import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChessBoard from './ChessBoard';
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
}

const VisualStage: React.FC<VisualStageProps> = ({ 
  activeCategory, 
  activeItem, 
  onSelectCategory, 
  onClearSelection, 
  onHome,
  hoveredCategory 
}) => {
  
  return (
    <div className="relative w-full h-full bg-[#1A1A1A] flex items-center justify-center overflow-hidden">
        
        {/* Layer 0: Jali Pattern Background */}
        <div className="absolute inset-0 jali-pattern pointer-events-none"></div>

        {/* Layer 1: The Board (Context) */}
        <div className={`absolute inset-0 transition-all duration-700 ease-out flex items-center justify-center gap-6 p-4 md:p-8 lg:p-12
            ${activeItem ? 'scale-95 opacity-50 blur-[1px]' : 'scale-100 opacity-100'}
        `}>
            {/* Evaluation Bar (Left of Board) - Always visible */}
            <div className="h-full max-h-[650px] flex items-center gap-2 shrink-0">
                <div className="flex-1 h-full w-12 bg-white border-4 border-[#2A2A2A] relative overflow-hidden shadow-xl">
                    {/* Black advantage (top half) */}
                    <div 
                        className="absolute left-0 right-0 top-0 bg-[#1A1A1A] transition-all duration-500"
                        style={{ height: activeItem?.complexityScore ? `${Math.max(0, 50 - (activeItem.complexityScore * 5))}%` : '50%' }}
                    ></div>
                    {/* Center line indicator */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#666] z-10"></div>
                </div>
                {/* Evaluation score beside the bar */}
                <span className="font-mono text-sm text-white font-bold">
                    {activeItem?.complexityScore ? activeItem.complexityScore.toFixed(1) : '0.0'}
                </span>
            </div>
            
            <ChessBoard 
                activeCategory={activeCategory} 
                activeItem={activeItem} // Pass item to trigger Black move
                onSelectCategory={onSelectCategory}
                hoveredCategory={hoveredCategory}
            />
        </div>

        {/* Layer 2: Detail Overlay (Glassmorphism) */}
        <AnimatePresence>
            {activeItem && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
                    className="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-6 md:p-8 lg:p-12"
                    onClick={onClearSelection} // Click outside to close
                >
                    <div 
                        className="w-full max-w-3xl bg-[#252525]/90 backdrop-blur-xl border border-[rgba(197,160,89,0.1)] shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Card Header */}
                        <div className="relative p-4 sm:p-6 md:p-8 border-b border-[#333] flex justify-between items-start gap-4">
                             <div className="flex-1">
                                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-2 leading-tight">{activeItem.title}</h2>
                                {activeItem.subtitle && (
                                    <p className="text-[#C5A059] font-mono text-xs uppercase tracking-widest">{activeItem.subtitle}</p>
                                )}
                                
                                {/* Chips / Badges */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {activeItem.badges?.map(badge => (
                                        <span key={badge} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] border border-[#333] rounded-full text-[10px] font-mono text-[#CCC] uppercase tracking-wide">
                                            <Star size={10} className="text-[#C5A059]" /> {badge}
                                        </span>
                                    ))}
                                    {activeItem.techStack?.slice(0, 3).map(tech => (
                                        <span key={tech} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] border border-[#333] rounded-full text-[10px] font-mono text-[#CCC] uppercase tracking-wide">
                                            <Code2 size={10} className="text-[#2A9D8F]" /> {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button 
                                onClick={onClearSelection}
                                className="text-xs flex items-center gap-1 text-[#888] hover:text-[#C5A059] transition-colors uppercase font-mono tracking-widest shrink-0"
                            >
                                <ArrowLeft size={12} /> Back
                            </button>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex flex-col md:flex-row gap-6 md:gap-8">
                            
                            {/* Main Content */}
                            <div className="flex-1">
                                <h3 className="font-mono text-[10px] uppercase text-[#666] mb-4 tracking-widest">Analysis</h3>
                                <p className="text-[#DDD] font-sans text-base md:text-lg leading-relaxed font-light mb-8">
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
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest rounded-sm transition-colors shadow-lg"
                                    >
                                        Execute Move <ExternalLink size={14} />
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