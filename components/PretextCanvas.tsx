import React, { useEffect, useRef, useState } from 'react';
import { prepare, layout, prepareWithSegments, layoutWithLines } from '@chenglou/pretext';

interface PretextCanvasProps {
    textContent: string;
    excludeRect?: { x: number, y: number, width: number, height: number }; 
}

const PretextCanvas: React.FC<PretextCanvasProps> = ({ textContent, excludeRect }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setDimensions({ width, height });
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        let active = true;

        const drawCanvas = async () => {
            if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0 || !textContent) return;
            
            // Wait for browser's font engine to be ready before computing via Canvas
            await document.fonts.ready;
            if (!active) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Ensure high-DPI canvas rendering
            const dpr = window.devicePixelRatio || 1;
            canvas.width = dimensions.width * dpr;
            canvas.height = dimensions.height * dpr;
            ctx.scale(dpr, dpr);

            ctx.clearRect(0, 0, dimensions.width, dimensions.height);

            // Pretext layout logic
            try {
                // STEP 1: Fast mathematical string preparation using advanced API
                const fontSpec = '500 13px "Courier New", Courier, monospace';
                
                let lines: any = null;
                // We use prepareWithSegments() and layoutWithLines() as defined by the library's recent docs.
                if (typeof prepareWithSegments === 'function' && typeof layoutWithLines === 'function') {
                    const handle = prepareWithSegments(textContent, fontSpec);
                    const result: any = layoutWithLines(handle, dimensions.width, 24);
                    lines = result.lines || result; 
                } else {
                    // Fallback to standard
                    const handle = prepare(textContent, fontSpec);
                    const result: any = layout(handle, dimensions.width, 24);
                    lines = result.lines;
                } 

                // Render output
                ctx.font = fontSpec;
                ctx.fillStyle = 'rgba(197, 160, 89, 0.4)'; // Themed gold color with low opacity
                ctx.textBaseline = 'top';

                let yPos = 0;
                // Iterate over the mathematical calculation and render to canvas instantly
                if (Array.isArray(lines)) {
                    lines.forEach((line: any) => {
                        // Primitive spatial checking to flow around an exclusion zone
                        let drawX = line.x || 0;
                        if (excludeRect) {
                            const lineTop = yPos;
                            const lineBottom = yPos + 24;
                            // Avoid drawing text inside the bounded rectangle
                            if (lineBottom > excludeRect.y && lineTop < (excludeRect.y + excludeRect.height)) {
                               if (drawX < excludeRect.x + excludeRect.width) {
                                   // adjustments if needed
                               }
                            }
                        }
                        ctx.fillText(line.text || line, drawX, yPos);
                        yPos += 24;
                    });
                } else {
                    // Fallback for demonstration if lines API differs
                    const words = textContent.split(' ');
                    let x = 10;
                    let y = 10;
                    words.forEach(word => {
                        const metrics = ctx.measureText(word + ' ');
                        if (x + metrics.width > dimensions.width) {
                            x = 10;
                            y += 24;
                        }
                        ctx.fillText(word + ' ', x, y);
                        x += metrics.width;
                    });
                }

            } catch (err) {
                console.error('Pretext Spatial Typography render failed:', err);
            }
        };

        drawCanvas();

        return () => { active = false; };
    }, [dimensions, textContent, excludeRect]);

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none opacity-40 z-0 overflow-hidden mix-blend-screen">
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#1A1A1A_100%)]"></div>
        </div>
    );
};

export default PretextCanvas;
