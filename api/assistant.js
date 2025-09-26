const { assistantRequestSchema, loadAssistantRuntime } = require('../src/server/assistantRuntime.cjs');
const logger = require('../src/logger.cjs');

const normaliseError = (error) =>
  error instanceof Error
    ? { message: error.message, stack: error.stack }
    : { message: String(error) };

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let payload = req.body;

  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch (error) {
      logger.warn('Assistant endpoint received invalid JSON payload', normaliseError(error));
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  const parsed = assistantRequestSchema.safeParse(payload);
  if (!parsed.success) {
    logger.warn('Rejected invalid assistant request payload (serverless)', {
      issues: parsed.error.errors,
    });
    return res.status(400).json({ error: 'Invalid request body', issues: parsed.error.errors });
  }

  try {
    const runtime = await loadAssistantRuntime();
    const { reply, sources, mode } = await runtime.runAssistant(parsed.data);
    logger.info('BlackBox Assistant (serverless) responded successfully', {
      sourceCount: sources.length,
      mode,
    });
    return res.json({ reply, sources, mode });
  } catch (error) {
    logger.error('Error while generating assistant response (serverless)', normaliseError(error));
    return res.status(500).json({ error: 'Assistant service unavailable' });
  }
};
