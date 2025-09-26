const { z } = require('zod');
const logger = require('../logger.cjs');

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
        'You are the BlackBox Qwen Research Companion. Guide visitors through Abir Abbas’ security-first AI portfolio, weaving in how analog synths, diaspora jazz sets, and club culture shape our vibe-coded agents. Lean on retrieved facts, respect visitor intent, and end with a bold takeaway that fuses business impact with creative energy.',
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

    const qwenApiKey = process.env.QWEN_API_KEY;
    const qwenBaseUrl = (process.env.QWEN_API_BASE || 'https://dashscope.aliyuncs.com/compatible-mode/v1').replace(/\/$/, '');
    const qwenModel = process.env.QWEN_MODEL || 'qwen3-coder-32b-instruct';
    const temperature = Number.parseFloat(process.env.QWEN_TEMPERATURE ?? '0.6');

    if (!qwenApiKey) {
      logger.warn(
        'QWEN_API_KEY not configured, BlackBox Assistant will respond with deterministic context summaries.'
      );
    }

    const invokeQwen = async ({ question, context, historyMessages }) => {
      if (!qwenApiKey) {
        return null;
      }

      const messages = await prompt.formatMessages({
        question,
        context,
        history: historyMessages,
      });

      const payload = {
        model: qwenModel,
        input: {
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
        },
        parameters: {
          temperature: Number.isNaN(temperature) ? 0.6 : temperature,
        },
      };

      const endpoint = `${qwenBaseUrl}/chat/completions`;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${qwenApiKey}`,
            'X-DashScope-Token': qwenApiKey,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          logger.error('Qwen API responded with a non-200 status', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });
          return null;
        }

        const data = await response.json();
        const choice = data?.output?.choices?.[0]?.message?.content;

        if (typeof choice !== 'string') {
          logger.error('Qwen payload missing expected content shape', { data });
          return null;
        }

        return choice;
      } catch (error) {
        logger.error('Failed to invoke Qwen model', {
          message: error?.message,
          stack: error?.stack,
        });
        return null;
      }
    };

    const runAssistant = async ({ message, history }) => {
      const docs = await retriever.getRelevantDocuments(message);
      const context = docs.map((doc) => doc.pageContent).join('\n---\n');
      const formattedHistory = formatHistory(history);

      const qwenReply = await invokeQwen({
        question: message,
        context,
        historyMessages: formattedHistory,
      });

      if (qwenReply) {
        return {
          reply: qwenReply,
          sources: docs.map((doc) => doc.metadata ?? {}),
          mode: 'qwen',
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

module.exports = {
  assistantRequestSchema,
  loadAssistantRuntime,
};
