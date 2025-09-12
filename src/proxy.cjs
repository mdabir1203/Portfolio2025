require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
});

app.use(express.json());
app.use(cors({ origin: 'https://your-domain.com', methods: ['POST'] }));
app.use(limiter);

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
if (!scriptUrl) {
  throw new Error('GOOGLE_APPS_SCRIPT_URL is not defined');
}

app.post('/', async (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request body', issues: parsed.error.errors });
  }

  const response = await fetch(scriptUrl, {
    method: 'POST',
    body: JSON.stringify(parsed.data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
