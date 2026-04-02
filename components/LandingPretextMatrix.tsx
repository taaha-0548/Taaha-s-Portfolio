import React, { useEffect, useRef, useState } from 'react';

// Chess piece characters to fall
const PIECES = ['♞', '♝', '♜', '♟', '♛', '♚', '♘', '♗', '♖'];

interface PhysicsObj {
    id: number;
    char: string;
    x: number;
    y: number;
    speedY: number;
    speedX: number;
    rotation: number;
    rotSpeed: number;
    size: number;
}

const LandingPretextMatrix: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    
    // Physics engine state references
    const physicsObjectsRef = useRef<PhysicsObj[]>([]);
    const animationRef = useRef<number>(0);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    // Track mouse
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
        };
    }, []);

    // Track container size
    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setDimensions({ width, height });
                
                // Initialize objects if empty or resize resets
                if (physicsObjectsRef.current.length === 0 && width > 0) {
                    // Increased amount of falling pieces!
                    const initObjs: PhysicsObj[] = Array.from({ length: 25 }).map((_, i) => ({
                        id: i,
                        char: PIECES[Math.floor(Math.random() * PIECES.length)],
                        x: Math.random() * width,
                        y: Math.random() * height, // Start anywhere on screen
                        speedY: 0.5 + Math.random() * 2,
                        speedX: (Math.random() - 0.5) * 0.5,
                        rotation: Math.random() * Math.PI * 2,
                        rotSpeed: (Math.random() - 0.5) * 0.05,
                        size: (width < 768 ? 20 : 40) + Math.random() * (width < 768 ? 30 : 60), 
                    }));
                    physicsObjectsRef.current = initObjs;
                }
            }
        });

        if (containerRef.current) resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Physics Animation and Pretext Loop
    useEffect(() => {
        let active = true;

        const loop = async () => {
            if (!canvasRef.current || dimensions.width === 0) {
                if (active) animationRef.current = requestAnimationFrame(loop);
                return;
            }

            // Await fonts before layout
            await document.fonts.ready;
            if (!active) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Handle DPI
            const dpr = window.devicePixelRatio || 1;
            canvas.width = dimensions.width * dpr;
            canvas.height = dimensions.height * dpr;
            ctx.scale(dpr, dpr);

            ctx.clearRect(0, 0, dimensions.width, dimensions.height);

            // Update Physics
            const objects = physicsObjectsRef.current;
            const mouse = mouseRef.current;

            objects.forEach(obj => {
                // Interactive mouse repulsion
                const dx = obj.x - mouse.x;
                const dy = obj.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const repelRadius = 150; // Interaction distance
                
                if (dist < repelRadius && dist > 0) {
                    const force = (repelRadius - dist) / repelRadius;
                    obj.speedX += (dx / dist) * force * 1.5;
                    obj.speedY += (dy / dist) * force * 1.5;
                }

                // Damping to return to normal falling flow over time
                obj.speedX *= 0.96; // Air resistance horizontally
                
                // Gravity / Terminal falling velocity
                const normalSpeedY = 1 + (obj.id % 2); // Base falling speed based on fake ID hash
                if (obj.speedY > normalSpeedY) obj.speedY -= 0.05;
                if (obj.speedY < normalSpeedY) obj.speedY += 0.05;

                obj.y += obj.speedY;
                obj.x += obj.speedX;
                obj.rotation += obj.rotSpeed + (obj.speedX * 0.01);

                // Reset logic when falling off screen (bottom bounds)
                if (obj.y > dimensions.height + obj.size) {
                    obj.y = -obj.size;
                    obj.x = Math.random() * dimensions.width;
                    obj.speedY = 1 + Math.random() * 2.5; 
                    obj.speedX = (Math.random() - 0.5) * 0.5;
                }
                
                // Wrap around horizontal boundaries if they get knocked completely sideways
                if (obj.x > dimensions.width + obj.size) obj.x = -obj.size;
                if (obj.x < -obj.size) obj.x = dimensions.width + obj.size;
            });

            const fontSpec = '500 12px "Courier New", Courier, monospace';
            
            // Native Render
            // Draw Falling Chess Pieces
            objects.forEach(obj => {
                ctx.save();
                ctx.translate(obj.x, obj.y);
                ctx.rotate(obj.rotation);
                ctx.font = `${obj.size}px serif`;
                // Subtly lit white/translucent piece
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(obj.char, 0, 0);
                
                // Add a glowing core to the piece
                ctx.fillStyle = 'rgba(197, 160, 89, 0.6)'; // Gold highlight
                ctx.fillText(obj.char, 0, 0);
                ctx.restore();
            });

            if (active) animationRef.current = requestAnimationFrame(loop);
        };

        animationRef.current = requestAnimationFrame(loop);

        return () => {
            active = false;
            cancelAnimationFrame(animationRef.current);
        };
    }, [dimensions]);

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            {/* Top fading gradient so tech text blends in gracefully from top header */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>
        </div>
    );
};

export default LandingPretextMatrix;
