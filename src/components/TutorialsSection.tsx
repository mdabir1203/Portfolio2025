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
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=${PLAYLIST_ID}&key=${API_KEY}`,
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
            .filter((v): v is Video => v !== null)
            .slice(0, 5),
        );
      } catch (err) {
        console.error('Failed to load videos', err);
      }
    };
    fetchVideos();
  }, []);

  return (
    <section className="mb-16 animate-fadeIn">
      <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#00695C] to-[#4DB6AC] bg-clip-text text-transparent">Tutorials</h2>
      <p className="text-xl text-[#E0F2F1] text-center mb-12 max-w-3xl mx-auto">
        Tutorials highlighting our AI-augmented thinking and projects.
      </p>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-auto rounded-xl border-2 border-[#4DB6AC]/30 group-hover:border-[#4DB6AC] transition-colors"
            />
            <h3 className="mt-2 text-lg text-[#E0F2F1] group-hover:text-[#4DB6AC]">{video.title}</h3>
          </a>
        ))}
      </div>
      <div className="text-center mt-8">
        <a
          href={`https://www.youtube.com/playlist?list=${PLAYLIST_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-[#009688] to-[#4DB6AC] hover:from-[#00695C] hover:to-[#009688] text-[#FAFAFA] font-bold py-3 px-6 rounded-lg border-2 border-transparent transition-all duration-300 text-shadow-glow transform hover:scale-105 hover:shadow-lg hover:shadow-[0_0_45px_rgba(0,150,136,0.4)]"
        >
          View All Tutorials on YouTube →
        </a>
      </div>
    </section>
  );
};

export default memo(TutorialsSection);
