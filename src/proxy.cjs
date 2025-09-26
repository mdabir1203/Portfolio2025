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
      vectorModule,
      embeddingsModule,
      promptsModule,
      messagesModule,
      qdrantModule,
    ] = await Promise.all([
      import('@langchain/community/vectorstores/qdrant'),
      import('langchain/embeddings/fake'),
      import('@langchain/core/prompts'),
      import('@langchain/core/messages'),
      import('@qdrant/js-client-rest'),
    ]);

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
      {
        text:
          'Sound & Flow — Studio playlists blend analog synthwave, diaspora jazz nights, and ambient club edits that inspire vibe-coded agent design and onboarding rituals.',
        metadata: { act: 'sound', label: 'Music Identity' },
      },
      {
        text:
          'Creative Stack — Beyond security research, we host underground listening sessions, prototype generative visuals, and remix field notes into zines to keep storytelling human.',
        metadata: { act: 'creative', label: 'Culture Layer' },
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

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        'You are the BlackBox Deep Research Companion. Guide visitors through Abir Abbas’ security-first AI portfolio, weaving in how analog synths, diaspora jazz sets, and club culture shape our vibe-coded agents. Lean on retrieved facts, respect visitor intent, and end with a bold takeaway that fuses business impact with creative energy.',
      ],
      new MessagesPlaceholder('history'),
      [
        'human',
        'Visitor says: {question}\n\nPortfolio intel:\n{context}\n\nDeliver a vivid, insight-rich answer that links craft, sound, and strategy. Close with a **Takeaway:** line.',
      ],
    ]);

    const formatHistory = (history) =>
      (history ?? []).map((entry) =>
        entry.role === 'assistant'
          ? new AIMessage(entry.content)
          : new HumanMessage(entry.content)
      );

    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    const openrouterReferer = process.env.OPENROUTER_REFERRER;
    const openrouterTitle = process.env.OPENROUTER_TITLE;

    if (!openrouterApiKey) {
      logger.warn(
        'OPENROUTER_API_KEY not configured, BlackBox Assistant will respond with deterministic context summaries.'
      );
    }

    const invokeDeepResearch = async ({ question, context, historyMessages }) => {
      if (!openrouterApiKey) {
        return null;
      }

      const messages = await prompt.formatMessages({
        question,
        context,
        history: historyMessages,
      });

      const payload = {
        model: 'alibaba/tongyi-deepresearch-30b-a3b',
        messages: messages.map((msg) => {
          const type = msg._getType();
          const role = type === 'human' ? 'user' : type === 'ai' ? 'assistant' : type;
          const content =
            typeof msg.content === 'string'
              ? msg.content
              : msg.content
                  .map((part) => (typeof part === 'string' ? part : part?.text ?? ''))
                  .join('');

          return {
            role,
            content,
          };
        }),
      };

      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openrouterApiKey}`,
            'Content-Type': 'application/json',
            ...(openrouterReferer ? { 'HTTP-Referer': openrouterReferer } : {}),
            ...(openrouterTitle ? { 'X-Title': openrouterTitle } : {}),
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          logger.error('OpenRouter responded with a non-200 status', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });
          return null;
        }

        const data = await response.json();
        const choice = data?.choices?.[0]?.message?.content;

        if (typeof choice !== 'string') {
          logger.error('OpenRouter payload missing expected content shape', { data });
          return null;
        }

        return choice;
      } catch (error) {
        logger.error('Failed to invoke OpenRouter DeepResearch model', normaliseError(error));
        return null;
      }
    };

    const runAssistant = async ({ message, history }) => {
      const docs = await retriever.getRelevantDocuments(message);
      const context = docs.map((doc) => doc.pageContent).join('\n---\n');
      const formattedHistory = formatHistory(history);

      const deepResearchReply = await invokeDeepResearch({
        question: message,
        context,
        historyMessages: formattedHistory,
      });

      if (deepResearchReply) {
        return {
          reply: deepResearchReply,
          sources: docs.map((doc) => doc.metadata ?? {}),
          mode: 'deepresearch',
        };
      }

      const fallbackReply = [
        'Here’s what the BlackBox playbook highlights:',
        context,
        'Soundtrack note: Sessions pulse with analog synthwave, diaspora jazz, and ambient club edits to keep human context front and center.',
        'Business & creative takeaway: secure, scalable, and human-aligned systems built on BlackBox, Agentverse, and Vibeverse — scored with the music that keeps our teams in flow.',
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
