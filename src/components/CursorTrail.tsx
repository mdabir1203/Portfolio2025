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

type RevealStyle = CSSProperties & {
  '--cursor-trail-duration'?: string;
};

type VeilStyle = CSSProperties & {
  '--cursor-trail-veil-opacity'?: string;
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInsideRef = useRef(false);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number>();


  const chosenImages = useMemo(() => images.filter(Boolean), [images]);
  const hasImages = chosenImages.length > 0;

  useEffect(() => {
    if (!hasImages) {
      return undefined;
    }

    const prune = () => {
      const now = performance.now();
      setItems((current) => {
        const filtered = current.filter((item) => now - item.createdAt < fadeDuration);
        if (filtered.length > 0) {
          rafRef.current = window.requestAnimationFrame(prune);
        } else {
          rafRef.current = undefined;
        }
        return filtered;
      });
    };

    if (items.length > 0 && rafRef.current === undefined) {
      rafRef.current = window.requestAnimationFrame(prune);
    }

    return () => {
      if (rafRef.current !== undefined) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
    };
  }, [fadeDuration, hasImages, items.length]);

  const updateRect = useCallback(() => {
    const node = containerRef.current;
    if (!node) {
      rectRef.current = null;
      return;
    }

    rectRef.current = node.getBoundingClientRect();
  }, []);

  useEffect(() => {
    if (!hasImages) {
      return undefined;
    }

    updateRect();

    const handleResize = () => updateRect();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [hasImages, updateRect]);

  const spawnItem = useCallback(
    (clientX: number, clientY: number) => {
      if (!hasImages) {
        return;
      }

      const now = performance.now();
      if (now - lastSpawnRef.current < spawnInterval) {
        return;
      }

      const rect = rectRef.current ?? containerRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return;
      }

      lastSpawnRef.current = now;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const image = chosenImages[Math.floor(Math.random() * chosenImages.length)];
      const size = 36 + Math.random() * 32;
      const rotation = -22 + Math.random() * 44;

      setItems((current) => {
        const filtered = current.filter((item) => now - item.createdAt < fadeDuration);
        const nextItems = [
          ...filtered,
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
    [chosenImages, fadeDuration, hasImages, maxItems, spawnInterval],
  );

  const handlePointerEnter = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      isInsideRef.current = true;
      updateRect();
      spawnItem(event.clientX, event.clientY);
    },
    [spawnItem, updateRect],
  );

  const handlePointerLeave = useCallback(() => {
    isInsideRef.current = false;
    setItems([]);
    if (rafRef.current !== undefined) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    if (!hasImages) {
      return undefined;
    }

    const handleWindowPointerMove = (event: PointerEvent) => {
      if (!isInsideRef.current) {
        return;
      }

      spawnItem(event.clientX, event.clientY);
    };

    window.addEventListener('pointermove', handleWindowPointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
    };
  }, [hasImages, spawnItem]);

  const outerClassName = ['relative block isolate', className].filter(Boolean).join(' ');
  const veilOpacity = items.length > 0 ? '0.56' : '0.26';
  const veilStyle: VeilStyle = {
    '--cursor-trail-veil-opacity': veilOpacity,
  };

  return (
    <div
      ref={containerRef}
      className={outerClassName}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div className="relative z-[1]">{children}</div>
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-visible">
        <div className="cursor-trail-veil" aria-hidden="true" style={veilStyle} />
        {items.map((item) => {
          const commonDuration = `${fadeDuration}ms`;
          const revealStyle: RevealStyle = {
            left: item.x,
            top: item.y,
            width: item.size * 1.85,
            height: item.size * 1.85,
            '--cursor-trail-duration': commonDuration,
          };
          const style: TrailStyle = {
            left: item.x,
            top: item.y,
            width: item.size,
            height: item.size,
            position: 'absolute',
            '--cursor-trail-rotate': `${item.rotation}deg`,
            '--cursor-trail-duration': commonDuration,
          };

          return (
            <Fragment key={item.id}>
              <div className="cursor-trail-reveal" style={revealStyle} />
              <img
                src={item.image}
                alt=""
                aria-hidden="true"
                className="cursor-trail-item select-none"
                style={style}
              />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CursorTrail;
