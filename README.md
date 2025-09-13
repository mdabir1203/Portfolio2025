# AI Alchemist Portfolio

Welcome to the digital workshop of **Mohammad Abir Abbas** – AI Whisperer, Rust artisan and vibe coder. This site is a living portfolio that fuses art, code and security.

## Preview:

https://github.com/user-attachments/assets/6fdf9f1e-a1e4-444f-8b4d-9969a759deb3


## What's Inside
- **Immersive single-page app** built with React and TypeScript.
- Sections for skills, projects, experience, services, tutorials, blog posts and a contact form.
- Animated canvas background, retro voxel effects and LinkedIn recommendations to add personality.
- Medium posts and YouTube playlists are fetched on the fly.
- A tiny Express proxy handles contact requests with Zod validation and rate limiting.
- SEO ready: meta tags, sitemap, robots/LLM directives and strict security headers.

## Tech Stack
- **React 18 + Vite 7** for a fast development experience.
- **TypeScript** for type safety.
- **Tailwind CSS** with `tailwindcss-animate` for design.
- **Express**, `cors`, `express-rate-limit` and **Zod** for the form proxy.
- **vite-plugin-sitemap** for automatic sitemap generation.
- **Yarn v3 (Berry)** as the package manager.

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

## Deployment & Security
Security headers and a strict Content Security Policy are configured in `vite.config.ts`.
The site also ships with a curated `robots.txt` and `sitemap.xml` for search engines and AI crawlers.

## License
MIT
