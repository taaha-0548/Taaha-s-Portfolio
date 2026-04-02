import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChessBoard from './ChessBoard';
import ReviewAvatar from './ReviewAvatar';
import PretextCanvas from './PretextCanvas';
import { CategoryType, PortfolioItem } from '../types';
import { THEME } from '../constants';
import { OPENING_METAPHORS } from '../constants/openingMetaphors';
import { ArrowLeft, ExternalLink, Star, Box, Code2, Home } from 'lucide-react';

interface VisualStageProps {
    activeCategory: CategoryType | null;
    activeItem: PortfolioItem | null;
    onSelectCategory: (cat: CategoryType) => void;
    onClearSelection: () => void;
    onHome: () => void;
    hoveredCategory?: CategoryType | null;
    onBoardTap?: () => void;
    onSelectItem: (item: PortfolioItem) => void;
    categories: Record<CategoryType, any>;
}

const VisualStage: React.FC<VisualStageProps> = ({
    activeCategory,
    activeItem,
    onSelectCategory,
    onClearSelection,
    onHome,
    hoveredCategory,
    onBoardTap,
    onSelectItem,
    categories
}) => {
    // Track if previous state had no item (fresh open vs switching)
    const prevHadItem = useRef(false);
    const isFirstOpen = activeItem && !prevHadItem.current;
    const [showBlur, setShowBlur] = useState(false);

    useEffect(() => {
        if (!activeItem) {
            // Closing: clear blur immediately
            setShowBlur(false);
        } else if (!prevHadItem.current) {
            // First open: delay blur to match modal
            const timer = setTimeout(() => setShowBlur(true), 700);
            return () => clearTimeout(timer);
        } else {
            // Switching items: blur immediately
            setShowBlur(true);
        }
        prevHadItem.current = !!activeItem;
    }, [activeItem]);

    return (
        <div className="relative w-full h-full bg-[#1A1A1A] flex items-center justify-center overflow-hidden">

            {/* Layer 0: Jali Pattern Background */}
            <div className="absolute inset-0 jali-pattern pointer-events-none"></div>

            {/* Layer 0.5: Pretext Spatial Typography Wall */}
            <PretextCanvas 
                textContent="[GAME DATA] 1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 The Grandmaster's Portfolio Engine v1.0. Analysis reveals significant strategic depth. Evaluating Next Moves: Projects, Research, Experience, Community. [MATE IN 4 DETECTED] Calculating optimal path... Engine evaluation +4.5 - Pretext dynamic sub-system engaged... 8. Qd2 b5 9. a3 Bb7 10. O-O-O Nbd7 11. Bd3 h6 12. Bh4 13. e5 dxe5 14. fxe5 Nxe5 The Sicilian Najdorf structure provides a complex foundation for learning and adaptation. " 
            />

            {/* Layer 1: The Board (Context) */}
            <div
                className={`absolute inset-0 transition-all duration-700 ease-out flex items-center justify-center gap-1 p-1 md:p-8 lg:p-12
            ${showBlur ? 'scale-95 opacity-50 blur-[1px]' : 'scale-100 opacity-100'}
        `}>
                {/* Container for eval bar + board to maintain proper sizing */}
                <div className="flex items-center gap-1 h-full w-full max-w-full max-h-full">
                    {/* Evaluation Bar (Left of Board) - Always visible */}
                    <div className="h-[min(95vw,calc(100vh-220px))] md:h-full w-8 sm:w-10 md:w-14 flex items-center gap-1 shrink-0">
                        <div className="flex-1 h-full w-full bg-white border border-[#2A2A2A] sm:border-2 md:border-4 relative overflow-hidden shadow-xl">
                            {/* Black advantage (top half) */}
                            <div
                                className="absolute left-0 right-0 top-0 bg-[#1A1A1A] transition-all duration-500"
                                style={{ height: activeItem?.complexityScore ? `${Math.max(0, 50 - (activeItem.complexityScore * 5))}%` : '50%' }}
                            ></div>
                            {/* Center line indicator */}
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] md:h-[2px] bg-[#666] z-10"></div>
                        </div>
                        {/* Evaluation score beside the bar */}
                        <span className="font-mono text-[9px] sm:text-xs md:text-sm text-white font-bold leading-none">
                            {activeItem?.complexityScore ? activeItem.complexityScore.toFixed(1) : '0.0'}
                        </span>
                    </div>

                    {/* Board wrapper with proper constraints */}
                    <div className="flex-1 h-full flex items-center justify-center min-w-0">
                        <ChessBoard
                            activeCategory={activeCategory}
                            activeItem={activeItem} // Pass item to trigger Black move
                            onSelectCategory={onSelectCategory}
                            hoveredCategory={hoveredCategory}
                            onSelectItem={onSelectItem}
                            categories={categories}
                        />
                    </div>
                </div>
            </div>



            {/* Layer 2: Detail Overlay (Glassmorphism) */}
            <AnimatePresence>
                {activeItem && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20, transition: { duration: 0.25, delay: 0 } }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: isFirstOpen ? 0.7 : 0 }}
                        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-12 lg:p-20"
                        onClick={onClearSelection}
                    >
                        <div
                            className="w-full md:max-w-3xl bg-[#252525]/95 backdrop-blur-xl border-t md:border border-[rgba(197,160,89,0.1)] shadow-2xl rounded-t-xl md:rounded-sm overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Card Header */}
                            <div className="relative p-3 sm:p-5 md:p-8 border-b border-[#333] flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
                                <div className="flex-1">
                                    <h2 className="text-lg sm:text-2xl md:text-4xl font-serif text-white mb-1 sm:mb-2 leading-tight">{activeItem.title}</h2>
                                    {activeItem.subtitle && (
                                        <p className="text-[#C5A059] font-mono text-[10px] sm:text-xs uppercase tracking-widest">{activeItem.subtitle}</p>
                                    )}

                                    {/* Chips / Badges */}
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                                        {activeItem.badges?.map(badge => (
                                            <span key={badge} className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 bg-[#1A1A1A] border border-[#333] rounded-full text-[9px] sm:text-[10px] font-mono text-[#CCC] uppercase tracking-wide">
                                                <Star size={9} className="text-[#C5A059]" /> {badge}
                                            </span>
                                        ))}
                                        {activeItem.techStack?.slice(0, 3).map(tech => (
                                            <span key={tech} className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 bg-[#1A1A1A] border border-[#333] rounded-full text-[9px] sm:text-[10px] font-mono text-[#CCC] uppercase tracking-wide">
                                                <Code2 size={9} className="text-[#2A9D8F]" /> {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={onClearSelection}
                                    className="text-[10px] sm:text-xs flex items-center gap-1 text-[#888] hover:text-[#C5A059] transition-colors uppercase font-mono tracking-widest shrink-0 mt-2 sm:mt-0"
                                >
                                    <ArrowLeft size={12} /> Back
                                </button>
                            </div>

                            {/* Card Body */}
                            <div className="p-3 sm:p-5 md:p-8 overflow-y-auto flex flex-col gap-4 sm:gap-8">

                                {/* Main Content */}
                                <div className="flex-1">
                                    <h3 className="font-mono text-[10px] uppercase text-[#666] mb-3 sm:mb-4 tracking-widest">Analysis</h3>
                                    <p className="text-[#DDD] font-sans text-sm sm:text-base md:text-lg leading-relaxed font-light mb-6 sm:mb-8">
                                        {activeItem.description}
                                    </p>

                                    {activeItem.techStack && (
                                        <div className="mb-8">
                                            <h3 className="font-mono text-[10px] uppercase text-[#666] mb-3 tracking-widest">Stack Inventory</h3>
                                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#AAA] font-mono">
                                                {activeItem.techStack.map(t => <span key={t}>- {t}</span>)}
                                            </div>
                                        </div>
                                    )}

                                    {activeItem.link && (
                                        <a
                                            href={activeItem.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-sm transition-colors shadow-lg w-full sm:w-auto"
                                        >
                                            Execute Move <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VisualStage;