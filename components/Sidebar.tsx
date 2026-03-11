import React, { useState } from 'react';
import { CategoryType, PortfolioItem, Category } from '../types';
import { THEME } from '../constants';
import { OPENING_METAPHORS } from '../constants/openingMetaphors';
import { Download, ChevronRight, ExternalLink, ChevronLeft, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewAvatar from './ReviewAvatar';

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
            <div className="sticky top-0 z-20 bg-[#1A1A1A]/95 backdrop-blur-sm border-b border-[#333] p-2.5 md:p-3 lg:p-4 xl:p-5 flex flex-row items-center justify-between shadow-sm">
                <div
                    className="flex items-center gap-1.5 md:gap-2 lg:gap-3 cursor-pointer group select-none"
                    onClick={onHome}
                    title="Return to Start"
                >
                    <ChevronLeft className="text-[#333] group-hover:text-[#C5A059] transition-colors" size={16} />
                    <div className="flex flex-col">
                        <h1 className="font-serif text-sm md:text-base lg:text-lg xl:text-xl text-white tracking-wide group-hover:text-[#C5A059] transition-colors">Muhammad Taaha</h1>
                    </div>
                </div>
                <button
                    onClick={onOpenResume}
                    className="flex items-center gap-1 md:gap-1.5 bg-[#C5A059] hover:bg-[#D4AF37] text-black px-2 md:px-3 lg:px-4 py-1 md:py-1.5 lg:py-2 rounded-sm font-bold text-[9px] md:text-[10px] lg:text-xs uppercase tracking-wider transition-all transform active:scale-95"
                >
                    <Download size={11} className="hidden md:block" />
                    <span className="hidden md:inline">Export Resume</span>
                    <span className="md:hidden">Resume</span>
                </button>
            </div>

            {/* 2. Grandmaster Review (Commentary) - Hidden on mobile (shown in top bar), visible on md+ */}
            <div className="hidden md:block px-2.5 md:px-3 lg:px-4 xl:px-5 py-2 md:py-3 lg:py-4 border-b border-[#333] shrink-0">
                <ReviewAvatar
                    activeItem={activeItem}
                    activeCategoryCommentary={activeCategory ? categories[activeCategory]?.commentary : undefined}
                    activeCategoryMoveGrade={activeCategory ? categories[activeCategory]?.moveGrade : undefined}
                    isSidebar={true}
                />
            </div>

            {/* 3. Move List (Annotated List) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                <div className="px-2.5 md:px-3 lg:px-4 xl:px-5 py-2 md:py-3 lg:py-4">
                    <h3 className="font-mono text-[9px] md:text-[10px] lg:text-[11px] uppercase text-[#666] tracking-widest mb-2 md:mb-3 lg:mb-4">Move List</h3>

                    <div className="space-y-1">
                        {(Object.values(categories) as Category[]).map((category) => {
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
                                        className={`w-full flex items-center text-left py-2 md:py-2.5 lg:py-3 xl:py-4 px-2 md:px-3 lg:px-4 rounded-sm transition-all duration-200 relative
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
                                        <span className={`font-mono text-[9px] md:text-[10px] lg:text-xs w-10 md:w-12 lg:w-14 xl:w-16 ${isActive ? 'text-[#C5A059]' : 'text-[#666] group-hover:text-[#888]'}`}>
                                            {category.notation}
                                        </span>

                                        {/* Title (Right) */}
                                        <div className="flex-1">
                                            <span className={`font-sans text-xs md:text-sm lg:text-base font-medium tracking-tight block ${isActive ? 'text-white' : 'text-[#BBB]'}`}>
                                                {category.label}
                                            </span>
                                            {isActive && (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-[8px] md:text-[9px] lg:text-[10px] text-[#666] font-mono mt-0.5 block"
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
                                                <div className="pl-6 md:pl-8 lg:pl-10 xl:pl-12 pr-2 md:pr-3 lg:pr-4 py-1.5 md:py-2 lg:py-3 space-y-0">
                                                    {category.items.map((item, index) => {
                                                        const isItemActive = activeItem?.id === item.id;
                                                        const isLastItem = index === category.items.length - 1;

                                                        return (
                                                            <div key={item.id} className="relative">
                                                                {/* Tree connector line */}
                                                                <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 flex items-start pt-2 sm:pt-3">
                                                                    {/* Vertical line */}
                                                                    {!isLastItem && (
                                                                        <div className="absolute left-2 sm:left-3 top-2 sm:top-3 bottom-0 w-[2px] bg-[#555]"></div>
                                                                    )}
                                                                    {/* Horizontal line */}
                                                                    <div className="flex items-center">
                                                                        <div className="w-2 sm:w-3 h-[2px] bg-[#555]"></div>
                                                                        <div className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full border-2 ${isItemActive ? 'bg-[#C5A059] border-[#C5A059]' : 'bg-[#1A1A1A] border-[#555]'}`}></div>
                                                                    </div>
                                                                </div>

                                                                {/* Item button */}
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); onSelectItem(item); }}
                                                                    className={`w-full text-left py-1.5 md:py-2 lg:py-2.5 pl-5 md:pl-6 lg:pl-8 pr-2 md:pr-3 rounded-sm transition-all duration-200 flex items-center justify-between group/item relative
                                                                ${isItemActive ? 'bg-[#2A2A2A] text-white' : 'text-[#888] hover:text-[#CCC] hover:bg-[#252525]'}
                                                            `}
                                                                >
                                                                    <span className={`text-[11px] md:text-xs lg:text-sm font-sans transition-colors ${isItemActive ? 'text-[#C5A059] font-medium' : ''}`}>
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