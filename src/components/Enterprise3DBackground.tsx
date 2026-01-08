import { FC, memo, useEffect, useRef, useState, useMemo } from 'react';

interface Enterprise3DBackgroundProps {
  scrollPosition: number;
  mousePosition: { x: number; y: number };
}

interface TechNode {
  id: number;
  angle: number;
  radius: number;
  depth: number;
  size: number;
  speed: number;
  color: string;
}

interface ConnectionLine {
  from: number;
  to: number;
  depth: number;
}

const Enterprise3DBackground: FC<Enterprise3DBackgroundProps> = ({ scrollPosition, mousePosition }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportCenter, setViewportCenter] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const resizeTimeoutRef = useRef<number | null>(null);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(hasTouch || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate viewport center with debounced resize
  useEffect(() => {
    const updateCenter = () => {
      setViewportCenter({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    };
    updateCenter();
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        cancelAnimationFrame(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = requestAnimationFrame(updateCenter);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        cancelAnimationFrame(resizeTimeoutRef.current);
      }
    };
  }, []);

  // Generate tech nodes in radial pattern (memoized for performance)
  // Reduce nodes on mobile for better performance
  const { nodes, connections } = useMemo(() => {
    const nodeCount = isMobile ? 6 : 12;
    const layers = isMobile ? 2 : 3;
    const nodesArray: TechNode[] = [];

    for (let layer = 0; layer < layers; layer++) {
      const layerRadius = 150 + layer * 200;
      const layerNodeCount = nodeCount - layer * 2;
      const depth = layer * 100;
      const baseSpeed = 0.3 + layer * 0.2;

      for (let i = 0; i < layerNodeCount; i++) {
        const angle = (i / layerNodeCount) * Math.PI * 2;
        const size = 20 - layer * 4;
        const colors = [
          'rgba(0, 191, 165, 0.6)',
          'rgba(77, 182, 172, 0.5)',
          'rgba(255, 112, 67, 0.4)',
        ];
        nodesArray.push({
          id: layer * 100 + i,
          angle,
          radius: layerRadius,
          depth,
          size,
          speed: baseSpeed,
          color: colors[layer % colors.length],
        });
      }
    }

    // Generate connection lines
    const connectionsArray: ConnectionLine[] = [];
    for (let i = 0; i < nodesArray.length; i++) {
      const node = nodesArray[i];
      // Connect to nearby nodes in same layer
      const nearbyNodes = nodesArray.filter(
        (n) => n.depth === node.depth && Math.abs(n.id - node.id) <= 3 && n.id !== node.id
      );
      nearbyNodes.forEach((target) => {
        if (!connectionsArray.find((c) => c.from === target.id && c.to === node.id)) {
          connectionsArray.push({
            from: node.id,
            to: target.id,
            depth: node.depth,
          });
        }
      });
    }

    return { nodes: nodesArray, connections: connectionsArray };
  }, [isMobile]);

  // Calculate parallax transforms (memoized calculation)
  // Reduce parallax intensity on mobile
  const getNodeTransform = (node: TechNode) => {
    const parallaxMultiplier = isMobile ? 0.3 : 1;
    const parallaxX = scrollPosition * node.speed * 50 * parallaxMultiplier;
    const parallaxY = scrollPosition * node.speed * 30 * parallaxMultiplier;
    const parallaxZ = scrollPosition * node.speed * 100 * parallaxMultiplier;

    const x = viewportCenter.x + Math.cos(node.angle + scrollPosition * 0.001) * node.radius + parallaxX;
    const y = viewportCenter.y + Math.sin(node.angle + scrollPosition * 0.001) * node.radius + parallaxY;
    const z = node.depth + parallaxZ;

    const rotationY = isMobile ? scrollPosition * 0.3 : mousePosition.x * 15 + scrollPosition * 0.5;
    const rotationX = isMobile ? scrollPosition * 0.2 : mousePosition.y * 10 + scrollPosition * 0.3;

    return {
      transform: `translate3d(${x - node.size / 2}px, ${y - node.size / 2}px, ${z}px) rotateY(${rotationY}deg) rotateX(${rotationX}deg)`,
      opacity: Math.max(0.3, 1 - Math.abs(z) / 500),
    };
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{
        perspective: isMobile ? '1000px' : '2000px',
        perspectiveOrigin: `${viewportCenter.x}px ${viewportCenter.y}px`,
        willChange: 'transform',
      }}
    >
      {/* Hexagonal Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(0, 191, 165, 0.1) 50px),
            repeating-linear-gradient(60deg, transparent, transparent 49px, rgba(0, 191, 165, 0.1) 50px),
            repeating-linear-gradient(120deg, transparent, transparent 49px, rgba(0, 191, 165, 0.1) 50px)
          `,
          transform: `translateZ(${scrollPosition * 20}px)`,
        }}
      />

      {/* Network Connection Lines */}
      <svg className="absolute inset-0" style={{ transform: `translateZ(${scrollPosition * 15}px)` }}>
        {connections.map((connection, idx) => {
          const fromNode = nodes.find((n) => n.id === connection.from);
          const toNode = nodes.find((n) => n.id === connection.to);
          if (!fromNode || !toNode) return null;

          const fromX = viewportCenter.x + Math.cos(fromNode.angle + scrollPosition * 0.001) * fromNode.radius;
          const fromY = viewportCenter.y + Math.sin(fromNode.angle + scrollPosition * 0.001) * fromNode.radius;
          const toX = viewportCenter.x + Math.cos(toNode.angle + scrollPosition * 0.001) * toNode.radius;
          const toY = viewportCenter.y + Math.sin(toNode.angle + scrollPosition * 0.001) * toNode.radius;

          return (
            <line
              key={`${connection.from}-${connection.to}-${idx}`}
              x1={fromX}
              y1={fromY}
              x2={toX}
              y2={toY}
              stroke="rgba(0, 191, 165, 0.15)"
              strokeWidth="1"
              className="animate-pulse"
              style={{
                filter: 'drop-shadow(0 0 2px rgba(0, 191, 165, 0.3))',
              }}
            />
          );
        })}
      </svg>

      {/* Tech Nodes */}
      {nodes.map((node) => {
        const transform = getNodeTransform(node);
        return (
          <div
            key={node.id}
            className="absolute tech-node"
            style={{
              width: `${node.size}px`,
              height: `${node.size}px`,
              ...transform,
              willChange: 'transform, opacity',
            }}
          >
            <div
              className="glass-premium rounded-full w-full h-full"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${node.color}, rgba(4, 21, 18, 0.3))`,
                border: `1px solid ${node.color}`,
                boxShadow: `
                  0 0 ${node.size * 2}px ${node.color},
                  0 0 ${node.size * 4}px ${node.color}40,
                  inset 0 0 ${node.size}px rgba(255, 255, 255, 0.15)
                `,
                backdropFilter: 'blur(8px) saturate(1.2)',
                WebkitBackdropFilter: 'blur(8px) saturate(1.2)',
              }}
            >
              {/* Inner glow */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle at center, ${node.color}, transparent)`,
                  opacity: 0.4,
                  animation: 'pulse-glow 3s ease-in-out infinite',
                  animationDelay: `${node.id * 0.1}s`,
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Data Flow Particles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + scrollPosition * 0.002;
        const radius = 300 + (i % 3) * 150;
        const x = viewportCenter.x + Math.cos(angle) * radius;
        const y = viewportCenter.y + Math.sin(angle) * radius;
        const parallaxZ = scrollPosition * 0.5 * 50;

        return (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: '4px',
              height: '4px',
              left: `${x}px`,
              top: `${y}px`,
              background: 'rgba(0, 191, 165, 0.8)',
              boxShadow: '0 0 8px rgba(0, 191, 165, 0.6)',
              transform: `translateZ(${parallaxZ}px)`,
              animation: `particle-flow 4s linear infinite`,
              animationDelay: `${i * 0.5}s`,
              willChange: 'transform, opacity',
            }}
          />
        );
      })}

      {/* Central Hub Node */}
      <div
        className="absolute tech-node"
        style={{
          width: '60px',
          height: '60px',
          left: `${viewportCenter.x - 30}px`,
          top: `${viewportCenter.y - 30}px`,
          transform: `translateZ(${scrollPosition * 30}px) rotateY(${mousePosition.x * 20}deg) rotateX(${mousePosition.y * 15}deg)`,
          willChange: 'transform',
        }}
      >
        <div
          className="glass-premium rounded-full w-full h-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(0, 191, 165, 0.85), rgba(77, 182, 172, 0.5), rgba(4, 21, 18, 0.4))',
            border: '2px solid rgba(0, 191, 165, 0.7)',
            boxShadow: `
              0 0 40px rgba(0, 191, 165, 0.6),
              0 0 80px rgba(0, 191, 165, 0.3),
              inset 0 0 30px rgba(255, 255, 255, 0.15)
            `,
            backdropFilter: 'blur(12px) saturate(1.3)',
            WebkitBackdropFilter: 'blur(12px) saturate(1.3)',
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at center, rgba(0, 191, 165, 0.6), transparent)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Enterprise3DBackground);
