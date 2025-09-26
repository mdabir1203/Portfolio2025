require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');

const logger = require('./logger.cjs');

const app = express();

const normaliseError = (error) =>
  error instanceof Error
    ? { message: error.message, stack: error.stack }
    : { message: String(error) };

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', normaliseError(reason));
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', normaliseError(error));
});

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
});

app.use(express.json());
app.use(cors({ origin: 'https://your-domain.com', methods: ['POST'] }));
app.use(limiter);

app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    logger.info('HTTP %s %s', req.method, req.originalUrl, {
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs * 1000) / 1000,
      userAgent: req.get('user-agent') ?? undefined,
    });
  });

  res.on('close', () => {
    if (!res.writableFinished) {
      logger.warn('HTTP %s %s closed before completing response', req.method, req.originalUrl, {
        userAgent: req.get('user-agent') ?? undefined,
      });
    }
  });

  next();
});

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
if (!scriptUrl) {
  throw new Error('GOOGLE_APPS_SCRIPT_URL is not defined');
}

app.post('/', async (req, res, next) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    logger.warn('Rejected invalid contact request payload', {
      issues: parsed.error.errors,
    });
    return res.status(400).json({ error: 'Invalid request body', issues: parsed.error.errors });
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      body: JSON.stringify(parsed.data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseBody = await response.text();

    if (!response.ok) {
      logger.error('Apps Script responded with an error status', {
        status: response.status,
        statusText: response.statusText,
        body: responseBody,
      });
      return res.status(502).json({ error: 'Upstream service error' });
    }

    let data;
    try {
      data = responseBody ? JSON.parse(responseBody) : {};
    } catch (error) {
      logger.error('Failed to parse Apps Script response as JSON', {
        responseBody,
        error: normaliseError(error),
      });
      return res.status(502).json({ error: 'Invalid response from upstream service' });
    }

    logger.info('Contact request forwarded successfully', {
      fields: Object.keys(parsed.data),
    });

    return res.json(data);
  } catch (error) {
    logger.error('Error forwarding contact request to Apps Script', normaliseError(error));
    return next(error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info('Proxy server running on port %d', PORT);
});

const assistantRequestSchema = z.object({
  message: z.string().min(1, 'Message must not be empty'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional(),
});

let assistantRuntimePromise;

const loadAssistantRuntime = async () => {
  if (assistantRuntimePromise) {
    return assistantRuntimePromise;
  }

  assistantRuntimePromise = (async () => {
    const [
      chatModule,
      vectorModule,
      embeddingsModule,
      promptsModule,
      messagesModule,
      qdrantModule,
    ] = await Promise.all([
      import('@langchain/community/chat_models/qwen'),
      import('@langchain/community/vectorstores/qdrant'),
      import('langchain/embeddings/fake'),
      import('@langchain/core/prompts'),
      import('@langchain/core/messages'),
      import('@qdrant/js-client-rest'),
    ]);

    const { ChatQwen } = chatModule;
    const { QdrantVectorStore } = vectorModule;
    const { FakeEmbeddings } = embeddingsModule;
    const { ChatPromptTemplate, MessagesPlaceholder } = promptsModule;
    const { AIMessage, HumanMessage } = messagesModule;
    const { QdrantClient } = qdrantModule;

    const knowledgeBase = [
      {
        text:
          'Act 1 · The Hook — Over 3,200 portfolio visits with 40% returning visitors. BlackBox Chronicles is the most binge-watched feature showcasing reverse engineering in Rust.',
        metadata: { act: 'hook', label: 'Engagement Proof' },
      },
      {
        text:
          'Act 2 · Watch Party — Rust rebuild demo on YouTube surpasses 12,000 views with a 4:30 average watch time and highlights a live exploit mitigation clip.',
        metadata: { act: 'watch-party', label: 'Video Analytics' },
      },
      {
        text:
          'Act 3 · Connections — BlackBox Chronicles proves technical mastery, Agentverse demonstrates scalable multi-agent workflows, and Vibeverse ensures human-centric adoption.',
        metadata: { act: 'connections', label: 'Ecosystem Map' },
      },
      {
        text:
          'Act 4 · Proof — Security impact: $500k potential breach prevented, Rust rebuild cuts memory usage by 40%, vibe-coded agents improve user retention by 25%.',
        metadata: { act: 'proof', label: 'Outcome Metrics' },
      },
      {
        text:
          'Act 5 · Finale — Roadmap evolves into a customer-ready agent framework delivering tailored BlackBox Assistants for enterprise workflows.',
        metadata: { act: 'finale', label: 'Roadmap' },
      },
    ];

    const embeddings = new FakeEmbeddings({ vectorSize: 1536 });

    let vectorStore;
    const qdrantUrl = process.env.QDRANT_URL;
    const qdrantApiKey = process.env.QDRANT_API_KEY;
    const qdrantCollection = process.env.QDRANT_COLLECTION || 'blackbox-assistant';

    if (qdrantUrl) {
      const client = new QdrantClient({
        url: qdrantUrl,
        apiKey: qdrantApiKey,
      });

      vectorStore = await QdrantVectorStore.fromTexts(
        knowledgeBase.map((item) => item.text),
        knowledgeBase.map((item) => item.metadata),
        embeddings,
        {
          client,
          collectionName: qdrantCollection,
        }
      );
    } else {
      const memoryModule = await import('langchain/vectorstores/memory');
      vectorStore = await memoryModule.MemoryVectorStore.fromTexts(
        knowledgeBase.map((item) => item.text),
        knowledgeBase.map((item) => item.metadata),
        embeddings
      );
      logger.warn(
        'QDRANT_URL not configured, falling back to in-memory vector store for BlackBox Assistant context.'
      );
    }

    const retriever = vectorStore.asRetriever({ k: 4 });

    const qwenApiKey = process.env.QWEN_API_KEY;
    const llm = qwenApiKey
      ? new ChatQwen({
          apiKey: qwenApiKey,
          model: process.env.QWEN_MODEL || 'qwen2.5-coder-32b',
          temperature: 0.3,
        })
      : null;

    if (!qwenApiKey) {
      logger.warn(
        'QWEN_API_KEY not configured, BlackBox Assistant will respond with deterministic context summaries.'
      );
    }

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        'You are the BlackBox Assistant guiding visitors through a five act narrative about a security-focused AI portfolio. Blend retrieved metrics with conversational storytelling. Always ground answers in the provided context and cite the business angle.',
      ],
      new MessagesPlaceholder('history'),
      [
        'human',
        'Visitor says: {question}\n\nContext:\n{context}\n\nRespond with an inviting, data-backed answer and finish with a business takeaway.',
      ],
    ]);

    const formatHistory = (history) =>
      (history ?? []).map((entry) =>
        entry.role === 'assistant'
          ? new AIMessage(entry.content)
          : new HumanMessage(entry.content)
      );

    const runAssistant = async ({ message, history }) => {
      const docs = await retriever.getRelevantDocuments(message);
      const context = docs.map((doc) => doc.pageContent).join('\n---\n');

      if (llm) {
        const response = await prompt.pipe(llm).invoke({
          question: message,
          context,
          history: formatHistory(history),
        });

        return {
          reply: response?.content ?? '',
          sources: docs.map((doc) => doc.metadata ?? {}),
          mode: 'llm',
        };
      }

      const fallbackReply = [
        'Here’s what the BlackBox playbook highlights:',
        context,
        'Business takeaway: secure, scalable, human-aligned systems built on BlackBox, Agentverse, and Vibeverse.',
      ]
        .filter(Boolean)
        .join('\n\n');

      return {
        reply: fallbackReply,
        sources: docs.map((doc) => doc.metadata ?? {}),
        mode: 'fallback',
      };
    };

    return { runAssistant };
  })();

  return assistantRuntimePromise;
};

app.post('/assistant', async (req, res) => {
  const parsed = assistantRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    logger.warn('Rejected invalid assistant request payload', {
      issues: parsed.error.errors,
    });
    return res.status(400).json({ error: 'Invalid request body', issues: parsed.error.errors });
  }

  try {
    const runtime = await loadAssistantRuntime();
    const { reply, sources, mode } = await runtime.runAssistant(parsed.data);
    logger.info('BlackBox Assistant responded successfully', {
      sourceCount: sources.length,
      mode,
    });
    return res.json({ reply, sources, mode });
  } catch (error) {
    logger.error('Error while generating assistant response', normaliseError(error));
    return res.status(500).json({ error: 'Assistant service unavailable' });
  }
});

app.use((err, req, res, next) => {
  logger.error('Unhandled error while processing request', {
    ...normaliseError(err),
    method: req.method,
    url: req.originalUrl,
  });

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({ error: 'Internal Server Error' });
});
