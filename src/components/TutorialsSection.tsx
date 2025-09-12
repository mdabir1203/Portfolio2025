import { FC, memo, useEffect, useState } from 'react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

interface YouTubePlaylistItemsResponse {
  items?: {
    snippet?: {
      title?: string;
      resourceId?: { videoId?: string };
      thumbnails?: { medium?: { url?: string } };
    };
  }[];
}

const PLAYLIST_ID = 'PLiMUBe7mFRXcRMOVEfH1YIoHa2h_8_0b9';
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const TutorialsSection: FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!API_KEY) return;
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${API_KEY}`,
        );
        const data: YouTubePlaylistItemsResponse = await res.json();
        setVideos(
          (data.items ?? [])
            .map((item) => {
              const id = item.snippet?.resourceId?.videoId;
              const title = item.snippet?.title;
              const thumbnail = item.snippet?.thumbnails?.medium?.url;
              if (!id || !title || !thumbnail) return null;
              return { id, title, thumbnail };
            })
            .filter((v): v is Video => v !== null),
        );
      } catch (err) {
        console.error('Failed to load videos', err);
      }
    };
    fetchVideos();
  }, []);

return (
  <section className="mb-16 animate-fadeIn">
    <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Tutorials</h2>
    <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
      Tutorials highlighting our AI-augmented thinking and projects.
    </p>
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <a
          key={video.id}
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-xl overflow-hidden border-2 border-white/10 transition-colors hover:border-cyan-400" // Kept codex's a tag styles
        >
          <img
            src={video.thumbnail}
            alt={`Tutorial: ${video.title}`} // Enhanced alt text for accessibility
            className="w-full aspect-video object-cover" // Kept codex's img styles
          />
          <h3 className="p-4 text-lg text-gray-200 group-hover:text-cyan-400">{video.title}</h3> // Kept codex's h3 styles (p-4 instead of mt-2)
        </a>
      ))}
    </div>
  </section>
);

export default memo(TutorialsSection);
