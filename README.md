# AI Alchemist Portfolio

Welcome to the digital workshop of **Mohammad Abir Abbas** – AI Whisperer, Rust artisan and vibe coder. This site is a living portfolio that fuses art, code and security.

## Preview:

https://github.com/user-attachments/assets/6fdf9f1e-a1e4-444f-8b4d-9969a759deb3


## What's Inside
- **Immersive single-page app** built with React and TypeScript.
- Sections for skills, projects, experience, services, tutorials, blog posts and a contact form.
- Animated canvas background, retro voxel effects and LinkedIn recommendations to add personality.
- Medium posts and YouTube playlists are fetched on the fly.
- A tiny Express proxy handles contact requests with Zod validation, rate limiting and Winston logging.
- SEO ready: meta tags, sitemap, robots/LLM directives and strict security headers.

## Tech Stack
- **React 18 + Vite 7** for a fast development experience.
- **TypeScript** for type safety.
- **Tailwind CSS** with `tailwindcss-animate` for design.
- **Express**, `cors`, `express-rate-limit` and **Zod** for the form proxy.
- **vite-plugin-sitemap** for automatic sitemap generation.
- **Yarn v4 (Berry)** as the package manager.

## Getting Started
```bash
yarn install
yarn dev       # start local server
yarn lint      # optional: lint sources (requires ESLint)
yarn build     # produce production assets
```

Set environment variables when needed:
- `VITE_YOUTUBE_API_KEY` – fetches playlist videos for the Tutorials section.
- `GOOGLE_APPS_SCRIPT_URL` – target of the Express proxy for contact submissions.

## Project Structure
```
src/
  artifact-component.tsx   # orchestrates sections and background effects
  components/              # UI sections (Home, Skills, Projects, etc.)
  data/                    # typed data for skills, services, projects...
  proxy.cjs                # Express proxy server
public/
  robots.txt, sitemap.xml, llms.txt  # SEO and crawler guidelines
```

## Logging & Proxy Usage
The contact form proxy is instrumented with a shared Winston logger defined in `src/logger.cjs`.

- Logs default to colourised, human-readable output during development and switch to JSON in production when `NODE_ENV=production`.
- Each request captures timing, status codes and the caller's user agent, while upstream failures and parse errors are surfaced as structured error logs.
- Unhandled rejections and uncaught exceptions are normalised before being emitted, making them easy to ingest in log aggregators.

Run the proxy locally alongside the Vite dev server:

```bash
GOOGLE_APPS_SCRIPT_URL="https://script.google.com/macros/s/YOUR_SCRIPT/exec" \
NODE_ENV=development \
node src/proxy.cjs
```

For production deployments, set `NODE_ENV=production` so logs are serialised as JSON for services like Logtail, Datadog or CloudWatch. The logger exports a singleton instance, so you can import it in additional middleware or utilities to keep log formatting consistent.

## Deployment & Security
Security headers and a strict Content Security Policy are configured in `vite.config.ts`.
The site also ships with a curated `robots.txt` and `sitemap.xml` for search engines and AI crawlers.

### Security Considerations
- Production secrets like API keys and SMTP credentials live in GitHub Secrets and are never committed.
- CI runs `yarn npm audit --severity high` to catch vulnerable dependencies.
- A scheduled monitor workflow pings the site, Medium feed and YouTube playlist and emails **md.abir1203@gmail.com** if any fail.

## License
MIT
