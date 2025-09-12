Portfolio based on React+Typescript+Vite built with Codex Cli by OpenAi

## Performance Goal

Strive for a fast, fluid experience:

- **Largest Contentful Paint** under 2 s on a 3G connection
- **Interaction latency** below 100 ms
- Maintain **60 fps** scrolling without layout shifts

Track these metrics with real user monitoring and adjust assets, code splitting and caching accordingly.

## Security

The project sets a restrictive Content Security Policy in `index.html` that allows only the resources needed to fetch and display Medium posts. Configure `frame-ancestors` via your hosting platform's HTTP headers for full protection.
