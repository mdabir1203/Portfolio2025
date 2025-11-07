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
      <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#c8fff4] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent drop-shadow-[0_16px_40px_rgba(0,150,136,0.25)]">
        Video Writeups
      </h2>
      <p className="text-xl text-[#d7f5ef] text-center mb-12 max-w-3xl mx-auto">
        Bite-sized video writeups highlighting our AI-augmented thinking and projects.
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
              className="w-full h-auto rounded-xl border border-[#2f6f68]/40 group-hover:border-[#00bfa5] transition-all duration-300 shadow-[0_20px_40px_rgba(0,150,136,0.2)]"
            />
            <h3 className="mt-2 text-lg text-[#a7ffeb] group-hover:text-[#c8fff4] transition-colors">{video.title}</h3>
          </a>
        ))}
      </div>
      <div className="text-center mt-8">
        <a
          href={`https://www.youtube.com/playlist?list=${PLAYLIST_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-[#00a99d] via-[#4DB6AC] to-[#00bfa5] hover:from-[#009688] hover:via-[#00a99d] hover:to-[#4DB6AC] text-[#052321] font-semibold tracking-wide py-3 px-6 rounded-lg border border-[#00bfa5]/40 transition-all duration-300 shadow-[0_20px_45px_rgba(0,150,136,0.35)] hover:-translate-y-0.5"
        >
          View All Video Writeups on YouTube →
        </a>
      </div>
    </section>
  );
};

export default memo(TutorialsSection);
