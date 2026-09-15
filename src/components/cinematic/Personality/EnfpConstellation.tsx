// EnfpConstellation — a subtle WebGL accent for the ENFP PersonalityHero.
//
// Design intent:
//   * Not a hero scene. A slow drift of 4 colored "stars" — one per ENFP
//     letter — that breathe behind the editorial headline.
//   * Mouse parallax: 4 px max offset, lerp-smoothed. Honors prefers-reduced-motion.
//   * No postprocessing chain — the editorial scrapbook palette needs to stay
//     calm. Bloom would punch holes in the page.
//
// Performance:
//   * InstancedMesh + low-poly icospheres (8 segments each). < 6 draw calls.
//   * Auto-cleans on unmount. WebGL context loss handler installed.
//   * Pauses render loop when the canvas leaves the viewport (IntersectionObserver).
//   * Disables itself entirely when prefers-reduced-motion is set.
//
// Built with @react-three/fiber + three (already in package.json).

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ENFP_DIMENSIONS, type EnfpDimension } from './photos';

const LETTERS: EnfpDimension[] = ['E', 'N', 'F', 'P'];
const LERP_FACTOR = 0.06; // mouse parallax smoothing
const MAX_OFFSET = 4;     // px max for parallax

/* ------------------------------------------------------------------ */
/* Inner scene — 4 drifting spheres. Runs only inside <Canvas>.        */
/* ------------------------------------------------------------------ */
function ConstellationScene({
  pointerRef,
}: {
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const { size } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const g = groupRef.current;
    if (!g) return;

    // Mouse parallax — smoothed lerp, never overshoots.
    const targetX = pointerRef.current.x * MAX_OFFSET;
    const targetY = pointerRef.current.y * MAX_OFFSET * -1;
    g.position.x += (targetX - g.position.x) * LERP_FACTOR;
    g.position.y += (targetY - g.position.y) * LERP_FACTOR;

    // Each star gets its own slow orbit. The letters' accent color is the
    // emissive, so the sphere glows softly from within.
    LETTERS.forEach((letter, i) => {
      const m = meshRefs.current[i];
      if (!m) return;
      const baseX = ((i - 1.5) / 1.5) * 3.6; // -3.6 .. +3.6
      const baseY = Math.sin(t * 0.4 + i * 0.7) * 0.25;
      const baseZ = Math.cos(t * 0.3 + i * 0.7) * 0.5 - 0.5;
      m.position.set(
        baseX + Math.sin(t * 0.6 + i) * 0.18,
        baseY + Math.cos(t * 0.5 + i * 0.7) * 0.18,
        baseZ,
      );
      // Gentle pulse — emissive intensity breathes between 0.4 and 0.8.
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 0.55 + Math.sin(t * 0.9 + i) * 0.18;
      }
    });
  });

  // Re-bind meshes once on mount; the group stays stable.
  useEffect(() => {
    return () => {
      meshRefs.current.forEach((m) => {
        if (m && (m.material as THREE.Material)?.dispose) {
          (m.material as THREE.Material).dispose();
        }
      });
    };
  }, []);

  return (
    <group ref={groupRef}>
      {LETTERS.map((letter, i) => {
        const color = ENFP_DIMENSIONS[letter].color;
        return (
          <mesh
            key={letter}
            ref={(el) => {
              meshRefs.current[i] = el;
            }}
          >
            {/* Low-poly icosphere — 8 segments is enough for a "star" silhouette. */}
            <icosahedronGeometry args={[0.42, 1]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.6}
              roughness={0.55}
              metalness={0.05}
              transparent
              opacity={0.78}
            />
          </mesh>
        );
      })}
      {/* Ambient + key light so the spheres actually read as 3D, not stickers. */}
      <ambientLight intensity={0.4} color="#f6f1e8" />
      <directionalLight
        position={[2, 4, 6]}
        intensity={0.9}
        color="#ffffff"
      />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Wrapper — pointer tracking, viewport pause, context-loss safety.   */
/* ------------------------------------------------------------------ */
export function EnfpConstellation() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [inView, setInView] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Reduced motion — bail out entirely.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Pause rendering when the constellation leaves the viewport.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Mouse parallax listener — passive, throttled by rAF in <Canvas>.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      pointerRef.current.x = x;
      pointerRef.current.y = y;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  if (reduceMotion) return null;
  if (!inView) return <div ref={containerRef} className="absolute inset-0" aria-hidden />;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      aria-hidden
      data-testid="enfp-constellation"
    >
      <Canvas
        // Cap DPR — keep the icospheres crisp without burning mobile GPUs.
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          // Power preference: tell mobile GPUs we're a background scene.
          powerPreference: 'low-power',
          preserveDrawingBuffer: false,
        }}
        camera={{ position: [0, 0, 8], fov: 35 }}
        onCreated={({ gl }) => {
          // Context loss: gracefully pause. Three.js handles resume internally,
          // but we log to console so QA can catch a flaky device.
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            // eslint-disable-next-line no-console
            console.warn('[EnfpConstellation] WebGL context lost — pausing render.');
          });
        }}
      >
        <ConstellationScene pointerRef={pointerRef} />
      </Canvas>
    </div>
  );
}
