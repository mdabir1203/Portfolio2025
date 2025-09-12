Portfolio based on React+Typescript+Vite built with Codex Cli by OpenAi

## Performance Goal

Strive for a fast, fluid experience:

- **Largest Contentful Paint** under 2 s on a 3G connection
- **Interaction latency** below 100 ms
- Maintain **60 fps** scrolling without layout shifts

Track these metrics with real user monitoring and adjust assets, code splitting and caching accordingly.

## Security

The project sets a restrictive Content Security Policy in `index.html` that allows only the resources needed to fetch and display Medium posts. Configure `frame-ancestors` via your hosting platform's HTTP headers for full protection.


## Tutorials

Explore tutorials of our AI-augmented thinking and project walkthroughs. The site pulls the latest videos from [this YouTube playlist](https://www.youtube.com/playlist?list=PLiMUBe7mFRXcRMOVEfH1YIoHa2h_8_0b9).

To fetch playlist data during development, provide a YouTube Data API key as `VITE_YOUTUBE_API_KEY` in a `.env` file (see `.env.example`).

### GitHub Actions

For CI runs, add the same key as a repository secret named `VITE_YOUTUBE_API_KEY` and expose it to the job environment:

```yaml
env:
  VITE_YOUTUBE_API_KEY: ${{ secrets.VITE_YOUTUBE_API_KEY }}
```
=======
## Video Overviews

Explore video overviews of our AI-augmented thinking and project walkthroughs in [this YouTube playlist](https://www.youtube.com/playlist?list=PLiMUBe7mFRXcRMOVEfH1YIoHa2h_8_0b9).
