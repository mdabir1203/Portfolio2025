import { FC, RefObject, memo } from 'react';
import Enterprise3DBackground from './Enterprise3DBackground';

interface BackgroundEffectsProps {
  mousePosition: { x: number; y: number };
  scrollPosition: number;
  canvasRef: RefObject<HTMLCanvasElement>;
}

const BackgroundEffects: FC<BackgroundEffectsProps> = ({ mousePosition, scrollPosition, canvasRef }) => (
  <>
    {/* Premium Enterprise 3D Background */}
    <Enterprise3DBackground scrollPosition={scrollPosition} mousePosition={mousePosition} />

    {/* Keep minimal retro cubes for subtle depth */}
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="retro-cube absolute"
          style={{
            left: `${20 + i * 30}%`,
            top: `${25 + i * 20}%`,
            animationDelay: `${i * 3}s`,
            animationDuration: `${25 + i * 5}s`,
            transform: `rotateY(${mousePosition.x * 15}deg) rotateX(${mousePosition.y * 15}deg) translateZ(${scrollPosition * 50}px)`
          }}
        >
          <div className="front bg-gradient-to-br from-[#00bfa5] to-[#007f72] opacity-20"></div>
          <div className="back bg-gradient-to-br from-[#4DB6AC] to-[#028678] opacity-20"></div>
          <div className="right bg-gradient-to-br from-[#FF7043] to-[#01887a] opacity-20"></div>
          <div className="left bg-gradient-to-br from-[#01887a] to-[#FF8A65] opacity-20"></div>
          <div className="top bg-gradient-to-br from-[#4DB6AC] to-[#FF8A65] opacity-20"></div>
          <div className="bottom bg-gradient-to-br from-[#FF8A65] to-[#4DB6AC] opacity-20"></div>
        </div>
      ))}
    </div>

    {/* Simplified mesh lines */}
    <div className="voxel-background opacity-10">
      <div className="mesh-wrapper">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="mesh-line"
            style={{
              animationDelay: `${i * 1}s`,
              animationDuration: `${12 + i * 2}s`
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
