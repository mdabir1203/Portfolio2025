import { FC, memo } from 'react';

const PLAYLIST_ID = 'PLiMUBe7mFRXcRMOVEfH1YIoHa2h_8_0b9';

const VideosSection: FC = () => (
  <section className="mb-16 animate-fadeIn">
    <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
      Video Overviews
    </h2>
    <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
      Quick looks at what we\u2019re building and writing with AI-augmented thinking.
    </p>
    <div className="max-w-3xl mx-auto">
      <iframe
        src={`https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}`}
        title="YouTube playlist"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full aspect-video rounded-xl border-2 border-white/10"
      />
    </div>
  </section>
);

export default memo(VideosSection);
