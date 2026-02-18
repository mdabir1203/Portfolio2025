import { FC, RefObject, memo } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import Enterprise3DBackground from './Enterprise3DBackground';

interface BackgroundEffectsProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  scrollValue: MotionValue<number>;
  canvasRef: RefObject<HTMLCanvasElement>;
}

const BackgroundEffects: FC<BackgroundEffectsProps> = ({ mouseX, mouseY, scrollValue, canvasRef }) => {
  // We use useTransform to create motion-driven style strings without re-renders
  const cubeTransform = () => {
    return useTransform(
      [mouseX, mouseY, scrollValue],
      ([x, y, s]: any[]) => `rotateY(${x * 15}deg) rotateX(${y * 15}deg) translateZ(${s * 50}px)`
    );
  };

  return (
    <>
      <Enterprise3DBackground scrollValue={scrollValue} mouseX={mouseX} mouseY={mouseY} />

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="retro-cube absolute"
            style={{
              left: `${20 + i * 30}%`,
              top: `${25 + i * 20}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${25 + i * 5}s`,
              transform: cubeTransform()
            }}
          >
            <div className="front bg-gradient-to-br from-[#00bfa5] to-[#007f72] opacity-20"></div>
            <div className="back bg-gradient-to-br from-[#4DB6AC] to-[#028678] opacity-20"></div>
            <div className="right bg-gradient-to-br from-[#FF7043] to-[#01887a] opacity-20"></div>
            <div className="left bg-gradient-to-br from-[#01887a] to-[#FF8A65] opacity-20"></div>
            <div className="top bg-gradient-to-br from-[#4DB6AC] to-[#FF8A65] opacity-20"></div>
            <div className="bottom bg-gradient-to-br from-[#FF8A65] to-[#4DB6AC] opacity-20"></div>
          </motion.div>
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
};

export default memo(BackgroundEffects);
