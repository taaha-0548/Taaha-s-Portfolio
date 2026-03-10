import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioItem } from '../types';

interface ReviewAvatarProps {
    activeItem: PortfolioItem | null;
    activeCategoryCommentary?: string;
    activeCategoryMoveGrade?: string;
    isSidebar?: boolean;
}

const ReviewAvatar: React.FC<ReviewAvatarProps> = ({
    activeItem,
    activeCategoryCommentary,
    activeCategoryMoveGrade,
    isSidebar = false
}) => {
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const WELCOME_MESSAGE = "Welcome to the game review! Choose any item from the move list below to get to know Taaha's strategic journey. !!";
    const [targetText, setTargetText] = useState(WELCOME_MESSAGE);

    // Core state-locking refs
    const explorationLocked = useRef(false);
    const prevCategoryRef = useRef<string | undefined>(activeCategoryCommentary);

    // 1. Logic for Snappy Category Switches vs Stable Item Hopping
    useEffect(() => {
        const itemContent = activeItem?.commentary;
        const categoryContent = activeCategoryCommentary;

        // Strictly check if the CATEGORY itself has changed
        const hasCategoryShifted = categoryContent !== prevCategoryRef.current;
        prevCategoryRef.current = categoryContent;

        if (itemContent || categoryContent) {
            explorationLocked.current = true;
        }

        // A. If an item is selected, update immediately (Done move)
        if (itemContent) {
            if (itemContent !== targetText) setTargetText(itemContent);
            return;
        }

        // B. Handle Category Content
        if (categoryContent) {
            // IF we explicitly shifted categories, we update the commentary IMMEDIATELY
            if (hasCategoryShifted) {
                setTargetText(categoryContent);
                return;
            }

            // C. Buffering Logic: Switching Items in the SAME Category
            const currentlyShowingItem = targetText !== categoryContent && targetText !== WELCOME_MESSAGE && targetText !== '';

            if (currentlyShowingItem) {
                const timeout = setTimeout(() => {
                    if (!activeItem) setTargetText(categoryContent);
                }, 550);
                return () => clearTimeout(timeout);
            } else if (categoryContent !== targetText) {
                setTargetText(categoryContent);
            }
        } else if (!explorationLocked.current) {
            if (targetText !== WELCOME_MESSAGE) setTargetText(WELCOME_MESSAGE);
        }
    }, [activeItem, activeCategoryCommentary, targetText]);

    // 2. Natural Typing Animation (Balanced for Readability)
    useEffect(() => {
        if (targetText === displayText && !isTyping) return;

        setIsTyping(true);
        setDisplayText('');

        let intervalId: NodeJS.Timeout | null = null;

        // Slight 50ms pulse for the Grandmaster "gathering his thoughts"
        const timeoutId = setTimeout(() => {
            let i = 0;
            let currentStr = '';

            intervalId = setInterval(() => {
                if (i < targetText.length) {
                    currentStr += targetText.charAt(i);
                    setDisplayText(currentStr);
                    i++;
                } else {
                    if (intervalId) clearInterval(intervalId);
                    setIsTyping(false);
                }
            }, 18); // Slowed down from 8ms to 18ms for more natural rhythm
        }, 50);

        return () => {
            clearTimeout(timeoutId);
            if (intervalId) clearInterval(intervalId);
        };
    }, [targetText]);

    const showMoveGrade = !!activeItem;
    const currentMoveGrade = activeItem?.moveGrade || activeCategoryMoveGrade;

    if (isSidebar) {
        return (
            <div className="w-full flex flex-col gap-4 mt-2">
                <div className="flex items-center gap-3">
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-14 h-14 rounded-full border-2 border-[#C5A059] bg-[#252525] overflow-hidden shrink-0 shadow-lg"
                    >
                        <img
                            src="/grandmaster_avatar.png"
                            alt="The Grandmaster"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-[0.2em] font-bold">Grandmaster Review</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-[#26D5CE] animate-pulse"></span>
                            <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">Analyzing Position...</span>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    {targetText && (
                        <div className="bg-white text-[#1A1A1A] p-4 md:p-5 rounded-2xl rounded-tl-none shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative">
                            {/* Bubble Tail */}
                            <div className="absolute -top-2 left-4 w-4 h-4 bg-white transform rotate-45"></div>

                            <p className="font-sans text-sm md:text-base font-bold leading-relaxed tracking-tight">
                                {displayText}
                                {isTyping && <span className="animate-pulse text-[#C5A059]">|</span>}
                            </p>

                            {showMoveGrade && currentMoveGrade && (
                                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <span className={`
                                        px-2 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest
                                        ${currentMoveGrade === 'BRILLIANT' ? 'bg-[#26D5CE] text-white' :
                                            currentMoveGrade === 'BEST' ? 'bg-[#98BC4B] text-white' :
                                                currentMoveGrade === 'GREAT' ? 'bg-[#5B8BB0] text-white' :
                                                    'bg-gray-200 text-gray-700'}
                                    `}>
                                        {currentMoveGrade.replace('_', ' ')}
                                    </span>

                                    <span className="text-[9px] font-mono text-gray-400 font-bold">ACCURACY: {(activeItem?.complexityScore || 8) * 10}%</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="absolute bottom-4 right-4 z-50 flex flex-row-reverse items-end gap-3 pointer-events-none">
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 md:w-18 md:h-18 rounded-full border-2 border-[#C5A059] bg-[#252525] overflow-hidden shadow-xl shrink-0"
            >
                <img
                    src="/grandmaster_avatar.png"
                    alt="The Grandmaster"
                    className="w-full h-full object-cover"
                />
            </motion.div>

            <div className="relative">
                {targetText && (
                    <div className="bg-white text-[#1A1A1A] p-3 md:p-4 rounded-2xl rounded-br-none shadow-2xl max-w-[200px] sm:max-w-[280px] md:max-w-md relative pointer-events-auto">
                        <div className="absolute -right-2 bottom-0 w-4 h-4 bg-white transform rotate-45"></div>

                        <p className="font-sans text-xs md:text-sm font-semibold leading-relaxed px-1">
                            {displayText}
                            {isTyping && <span className="animate-pulse">_</span>}
                        </p>

                        {showMoveGrade && currentMoveGrade && (
                            <div className="mt-2 flex items-center gap-1.5 pt-2 border-t border-gray-100">
                                <span className={`
                                    px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-tighter
                                    ${currentMoveGrade === 'BRILLIANT' ? 'bg-[#26D5CE] text-white' :
                                        currentMoveGrade === 'BEST' ? 'bg-[#98BC4B] text-white' :
                                            currentMoveGrade === 'GREAT' ? 'bg-[#5B8BB0] text-white' :
                                                'bg-gray-200 text-gray-700'}
                                `}>
                                    {currentMoveGrade.replace('_', ' ')}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewAvatar;
