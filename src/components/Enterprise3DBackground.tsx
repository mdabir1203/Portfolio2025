import { FC, memo, useEffect, useRef } from 'react';
import { MotionValue } from 'framer-motion';

interface Enterprise3DBackgroundProps {
  scrollValue: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
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

interface Connection {
  fromNode: TechNode;
  toNode: TechNode;
}

const Enterprise3DBackground: FC<Enterprise3DBackgroundProps> = ({ scrollValue, mouseX, mouseY }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeDataRef = useRef<{ nodes: TechNode[]; connections: Connection[] } | null>(null);
  const timeRef = useRef(0);

  // Initialize nodes only once or when screen size changes significantly
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 8 : 16;
    const layers = isMobile ? 2 : 3;
    const nodes: TechNode[] = [];

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
          'rgba(25, 207, 190, 0.4)',
        ];
        nodes.push({
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

    const connections: Connection[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const sameLayerNodes = nodes.filter(n => n.depth === node.depth && n.id !== node.id);
      // Connect to a few nearby nodes in same layer
      for (let j = 0; j < Math.min(2, sameLayerNodes.length); j++) {
        const target = sameLayerNodes[(i + j + 1) % sameLayerNodes.length];
        connections.push({ fromNode: node, toNode: target });
      }
    }

    nodeDataRef.current = { nodes, connections };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      if (!ctx || !nodeDataRef.current) return;

      const { nodes, connections } = nodeDataRef.current;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      const s = scrollValue.get();
      const mX = mouseX.get();
      const mY = mouseY.get();
      const time = timeRef.current;
      timeRef.current += 1;

      ctx.clearRect(0, 0, width, height);

      // Perspective helper
      const getPos = (node: TechNode) => {
        const idleX = Math.cos(time * 0.01 + node.id) * 10;
        const idleY = Math.sin(time * 0.01 + node.id) * 10;

        const angle = node.angle + s * 0.001 + time * 0.002;
        const radius = node.radius;

        const basePX = Math.cos(angle) * radius;
        const basePY = Math.sin(angle) * radius;

        const parallaxX = s * node.speed * 50 + mX * 20 + idleX;
        const parallaxY = s * node.speed * 30 + mY * 20 + idleY;
        const parallaxZ = node.depth + s * node.speed * 100;

        const x = centerX + basePX + parallaxX;
        const y = centerY + basePY + parallaxY;
        const zScale = 1 - Math.abs(parallaxZ) / 2000;

        return { x, y, zScale };
      };

      // Draw connections first
      ctx.lineWidth = 0.5;
      connections.forEach(({ fromNode, toNode }) => {
        const p1 = getPos(fromNode);
        const p2 = getPos(toNode);

        const opacity = Math.max(0.01, p1.zScale * 0.1);
        ctx.strokeStyle = `rgba(0, 191, 165, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach(node => {
        const p = getPos(node);
        const size = node.size * p.zScale;
        const opacity = Math.max(0.1, p.zScale * 0.4);

        ctx.save();
        ctx.translate(p.x, p.y);

        // Node Glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2);
        gradient.addColorStop(0, node.color.replace('0.6', String(opacity)));
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Node Core
        ctx.fillStyle = node.color.replace('0.6', '0.8');
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // Central Hub
      const hubPos = { x: centerX, y: centerY };
      const hubParallaxZ = s * 30;
      const hubScale = 1 - Math.abs(hubParallaxZ) / 2000;
      const hubSize = 30 * hubScale;

      ctx.save();
      ctx.translate(hubPos.x + mX * 30, hubPos.y + mY * 30);

      const hubGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, hubSize * 3);
      hubGrad.addColorStop(0, `rgba(0, 191, 165, ${0.4 * hubScale})`);
      hubGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = hubGrad;
      ctx.beginPath();
      ctx.arc(0, 0, hubSize * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

export default memo(Enterprise3DBackground);
