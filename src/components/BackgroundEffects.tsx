import { FC, RefObject, memo } from 'react';

interface BackgroundEffectsProps {
  mousePosition: { x: number; y: number };
  canvasRef: RefObject<HTMLCanvasElement>;
}

const BackgroundEffects: FC<BackgroundEffectsProps> = ({ mousePosition, canvasRef }) => (
  <>
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="retro-cube absolute"
          style={{
            left: `${15 + i * 12}%`,
            top: `${20 + i * 8}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${15 + i * 3}s`,
            transform: `rotateY(${mousePosition.x * 20}deg) rotateX(${mousePosition.y * 20}deg)`
          }}
        >
          <div className="front bg-gradient-to-br from-[#00bfa5] to-[#007f72] opacity-55"></div>
          <div className="back bg-gradient-to-br from-[#4DB6AC] to-[#028678] opacity-55"></div>
          <div className="right bg-gradient-to-br from-[#FF7043] to-[#01887a] opacity-55"></div>
          <div className="left bg-gradient-to-br from-[#01887a] to-[#FF8A65] opacity-55"></div>
          <div className="top bg-gradient-to-br from-[#4DB6AC] to-[#FF8A65] opacity-55"></div>
          <div className="bottom bg-gradient-to-br from-[#FF8A65] to-[#4DB6AC] opacity-55"></div>
        </div>
      ))}
    </div>

    <div className="voxel-background">
      <div className="mesh-wrapper">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="mesh-line"
            style={{
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${8 + i}s`
            }}
          ></div>
        ))}
      </div>
    </div>

    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-10 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    ></canvas>
  </>
);

export default memo(BackgroundEffects);
