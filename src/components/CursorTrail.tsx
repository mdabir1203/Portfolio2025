import { CSSProperties, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface CursorTrailProps {
  images: string[];
  children: ReactNode;
  className?: string;
  spawnInterval?: number;
  maxItems?: number;
  fadeDuration?: number;
}

interface TrailItem {
  id: number;
  x: number;
  y: number;
  image: string;
  createdAt: number;
  size: number;
  rotation: number;
}

type TrailStyle = CSSProperties & {
  '--cursor-trail-rotate'?: string;
  '--cursor-trail-duration'?: string;
};

const DEFAULT_SPAWN_INTERVAL = 70;
const DEFAULT_MAX_ITEMS = 28;
const DEFAULT_FADE_DURATION = 900;

const CursorTrail: FC<CursorTrailProps> = ({
  images,
  children,
  className,
  spawnInterval = DEFAULT_SPAWN_INTERVAL,
  maxItems = DEFAULT_MAX_ITEMS,
  fadeDuration = DEFAULT_FADE_DURATION,
}) => {
  const [items, setItems] = useState<TrailItem[]>([]);
  const lastSpawnRef = useRef(0);
  const idRef = useRef(0);

  const chosenImages = useMemo(() => images.filter(Boolean), [images]);
  const hasImages = chosenImages.length > 0;

  useEffect(() => {
    if (!hasImages) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      const now = performance.now();
      setItems((current) => current.filter((item) => now - item.createdAt < fadeDuration));
    }, Math.max(120, Math.floor(fadeDuration / 5)));

    return () => {
      window.clearInterval(interval);
    };
  }, [fadeDuration, hasImages]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!hasImages) {
        return;
      }

      const now = performance.now();
      if (now - lastSpawnRef.current < spawnInterval) {
        return;
      }

      lastSpawnRef.current = now;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const image = chosenImages[Math.floor(Math.random() * chosenImages.length)];
      const size = 32 + Math.random() * 26;
      const rotation = -18 + Math.random() * 36;

      setItems((current) => {
        const nextItems = [
          ...current,
          {
            id: idRef.current++,
            x,
            y,
            image,
            createdAt: now,
            size,
            rotation,
          },
        ];

        if (nextItems.length > maxItems) {
          return nextItems.slice(nextItems.length - maxItems);
        }

        return nextItems;
      });
    },
    [chosenImages, hasImages, maxItems, spawnInterval],
  );

  const handlePointerLeave = useCallback(() => {
    setItems([]);
  }, []);

  const outerClassName = ['relative block', className].filter(Boolean).join(' ');

  return (
    <div className={outerClassName} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      {children}
      <div className="pointer-events-none absolute inset-0 overflow-visible">
        {items.map((item) => {
          const style: TrailStyle = {
            left: item.x,
            top: item.y,
            width: item.size,
            height: item.size,
            position: 'absolute',
            '--cursor-trail-rotate': `${item.rotation}deg`,
            '--cursor-trail-duration': `${fadeDuration}ms`,
          };

          return (
            <img key={item.id} src={item.image} alt="" aria-hidden="true" className="cursor-trail-item select-none" style={style} />
          );
        })}
      </div>
    </div>
  );
};

export default CursorTrail;
