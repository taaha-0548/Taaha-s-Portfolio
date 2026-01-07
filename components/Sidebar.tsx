import React, { useState } from 'react';
import { CategoryType, PortfolioItem, Category } from '../types';
import { THEME } from '../constants';
import { OPENING_METAPHORS } from '../constants/openingMetaphors';
import { Download, ChevronRight, ExternalLink, ChevronLeft, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  activeCategory: CategoryType | null;
  activeItem: PortfolioItem | null;
  onSelectCategory: (cat: CategoryType) => void;
  onSelectItem: (item: PortfolioItem) => void;
  onOpenResume: () => void;
  onHome: () => void;
  categories: Record<CategoryType, Category>;
  onHoverCategory?: (cat: CategoryType | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeCategory, 
  activeItem, 
  onSelectCategory, 
  onSelectItem, 
  onOpenResume, 
  onHome, 
  categories,
  onHoverCategory 
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<CategoryType | null>(null);
  
  return (
    <div className="w-full h-full bg-[#1A1A1A] flex flex-col border-l border-[#333] relative">
      
      {/* 1. Sticky Header (Command Center Top) */}
      <div className="sticky top-0 z-20 bg-[#1A1A1A]/95 backdrop-blur-sm border-b border-[#333] p-6 flex flex-row items-center justify-between shadow-sm">
         <div 
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={onHome}
            title="Return to Start"
         >
             <ChevronLeft className="text-[#333] group-hover:text-[#C5A059] transition-colors" size={20} />
             <div className="flex flex-col">
                <h1 className="font-serif text-xl text-white tracking-wide group-hover:text-[#C5A059] transition-colors">Muhammad Taaha</h1>
             </div>
         </div>
         <button 
            onClick={onOpenResume}
            className="flex items-center gap-2 bg-[#C5A059] hover:bg-[#D4AF37] text-black px-4 py-2 rounded-sm font-bold text-xs uppercase tracking-wider transition-all transform active:scale-95"
         >
            <Download size={14} /> Export Resume
         </button>
      </div>

      {/* 2. Move List (Annotated List) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
        <div className="px-6 py-4">
            <h3 className="font-mono text-[11px] uppercase text-[#666] tracking-widest mb-4">Move List</h3>
            
            <div className="space-y-1">
                {Object.values(categories).map((category) => {
                    const isActive = activeCategory === category.id;
                    
                    return (
                        <div key={category.id} className="group relative">
                            {/* Tooltip */}
                            <AnimatePresence>
                                {hoveredCategory === category.id && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute left-full ml-4 top-0 z-30 w-64 pointer-events-none hidden lg:block"
                                    >
                                        <div className="bg-[#2A2A2A] border border-[#C5A059]/30 rounded-sm p-4 shadow-xl">
                                            <div className="flex items-start gap-2 mb-2">
                                                <Info size={14} className="text-[#C5A059] mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-serif text-white text-sm mb-1">
                                                        {OPENING_METAPHORS[category.id].name}
                                                    </h4>
                                                    <p className="text-[#C5A059] font-mono text-xs uppercase tracking-wider">
                                                        {OPENING_METAPHORS[category.id].metaphor}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-[#AAA] text-xs leading-relaxed">
                                                {OPENING_METAPHORS[category.id].description}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* The Move Item */}
                            <button
                                onClick={() => onSelectCategory(category.id)}
                                onMouseEnter={() => {
                                    setHoveredCategory(category.id);
                                    onHoverCategory?.(category.id);
                                }}
                                onMouseLeave={() => {
                                    setHoveredCategory(null);
                                    onHoverCategory?.(null);
                                }}
                                className={`w-full flex items-center text-left py-4 px-4 rounded-sm transition-all duration-200 relative
                                    ${isActive ? 'bg-[#252525]' : 'hover:bg-[#252525]'}
                                `}
                            >
                                {/* Active Indicator (Gold Bar) */}
                                {isActive && (
                                    <motion.div 
                                        layoutId="active-gold-bar"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-[#C5A059]"
                                    />
                                )}

                                {/* Notation (Left) */}
                                <span className={`font-mono text-xs w-16 ${isActive ? 'text-[#C5A059]' : 'text-[#666] group-hover:text-[#888]'}`}>
                                    {category.notation}
                                </span>

                                {/* Title (Right) */}
                                <div className="flex-1">
                                    <span className={`font-sans text-base font-medium tracking-tight block ${isActive ? 'text-white' : 'text-[#BBB]'}`}>
                                        {category.label}
                                    </span>
                                    {isActive && (
                                        <motion.span 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-[10px] text-[#666] font-mono mt-0.5 block"
                                        >
                                            {category.description}
                                        </motion.span>
                                    )}
                                </div>
                            </button>

                            {/* Sub-moves (Items) - Rendered nicely indented */}
                            <AnimatePresence>
                                {isActive && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-[#202020] border-t border-[#333]"
                                    >
                                        <div className="pl-12 pr-4 py-3 space-y-0">
                                            {category.items.map((item, index) => {
                                                const isItemActive = activeItem?.id === item.id;
                                                const isLastItem = index === category.items.length - 1;
                                                
                                                return (
                                                    <div key={item.id} className="relative">
                                                        {/* Tree connector line */}
                                                        <div className="absolute left-0 top-0 bottom-0 w-8 flex items-start pt-3">
                                                            {/* Vertical line */}
                                                            {!isLastItem && (
                                                                <div className="absolute left-3 top-3 bottom-0 w-[2px] bg-[#555]"></div>
                                                            )}
                                                            {/* Horizontal line */}
                                                            <div className="flex items-center">
                                                                <div className="w-3 h-[2px] bg-[#555]"></div>
                                                                <div className={`w-2 h-2 rounded-full border-2 ${isItemActive ? 'bg-[#C5A059] border-[#C5A059]' : 'bg-[#1A1A1A] border-[#555]'}`}></div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Item button */}
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onSelectItem(item); }}
                                                            className={`w-full text-left py-2.5 pl-8 pr-3 rounded-sm transition-all duration-200 flex items-center justify-between group/item relative
                                                                ${isItemActive ? 'bg-[#2A2A2A] text-white' : 'text-[#888] hover:text-[#CCC] hover:bg-[#252525]'}
                                                            `}
                                                        >
                                                            <span className={`text-sm font-sans transition-colors ${isItemActive ? 'text-[#C5A059] font-medium' : ''}`}>
                                                                {item.title}
                                                            </span>
                                                            {item.link && (
                                                                <ExternalLink 
                                                                    size={10} 
                                                                    className={`transition-opacity ${isItemActive ? 'opacity-60' : 'opacity-0 group-hover/item:opacity-100'}`} 
                                                                />
                                                            )}
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;