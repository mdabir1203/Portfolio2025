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
