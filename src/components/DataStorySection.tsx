import { FC, memo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const DataStorySection: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Chaos Animation Logic
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;
            opacity: number;
        }> = [];

        const init = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            particles = [];
            for (let i = 0; i < 20; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: Math.random() * 8 + 2,
                    color: '#0ef9d7',
                    opacity: Math.random() * 0.5 + 0.1,
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleResize = () => init();
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div ref={containerRef} className="py-32 px-6 max-w-7xl mx-auto relative overflow-hidden">
            {/* Background Data Resonance (Data Story) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="space-y-4 glass-panel p-8 rounded-3xl border-white/5"
                >
                    <p className="text-primary font-mono text-[10px] tracking-widest uppercase">// ASSET PROTECTION</p>
                    <h3 className="text-4xl font-bold text-white font-serif">$5,000+</h3>
                    <p className="text-sand/60 text-sm leading-relaxed">Financial loss prevented per automated exploit attempt by closing high-stakes logic gaps.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4 glass-panel p-8 rounded-3xl border-primary/20 bg-primary/5"
                >
                    <p className="text-primary font-mono text-[10px] tracking-widest uppercase">// TIME RECAPTURE</p>
                    <h3 className="text-4xl font-bold text-white font-serif">99.4%</h3>
                    <p className="text-sand/60 text-sm leading-relaxed">Reduction in manual audit cycles (48h → 15m), allowing for rapid security-first deployments.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4 glass-panel p-8 rounded-3xl border-white/5"
                >
                    <p className="text-primary font-mono text-[10px] tracking-widest uppercase">// NETWORK REACH</p>
                    <h3 className="text-4xl font-bold text-white font-serif">5.6k+</h3>
                    <p className="text-sand/60 text-sm leading-relaxed">Strategic resonance across the global digital layer, bridging culture with AI compliance.</p>
                </motion.div>
            </div>

            {/* Crafted with Chaos (User's Specific Animation Request) */}
            <div className="relative flex flex-col items-center justify-center text-center">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none opacity-40 blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="relative z-10 space-y-2 py-12"
                >
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[0.85] tracking-tighter">
                        Crafted with <span className="text-primary">&lt;3/&gt;</span>
                    </h2>
                    <p className="text-4xl md:text-6xl italic text-sand/40 font-serif">
                        And a touch of <span className="text-primary/60">chaos.</span>
                    </p>

                    <div className="mt-12 flex items-center justify-center gap-4 pt-12 border-t border-white/5">
                        <p className="text-sm font-mono text-sand/60 tracking-wider">Mohammad Abir Abbas.</p>
                        <div className="px-3 py-1 bg-primary text-background font-mono text-xs font-bold uppercase tracking-widest">
                            Efficiency Architect.
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default memo(DataStorySection);
