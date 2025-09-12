import { FC, memo } from 'react';

const VideosSection: FC = () => (
  <section className="mb-16 animate-fadeIn">
    <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Video Overviews</h2>
    <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
      Video overviews of our AI-augmented thinking and projects.
    </p>
    <div className="relative overflow-hidden" style={{ paddingTop: '56.25%' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-xl border-2 border-white/10"
        src="https://www.youtube.com/embed/videoseries?list=PLiMUBe7mFRXcRMOVEfH1YIoHa2h_8_0b9"
        title="YouTube playlist"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  </section>
);

export default memo(VideosSection);
