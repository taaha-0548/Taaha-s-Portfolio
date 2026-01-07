import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHESS_JOKES } from '../constants';

const LoadingScreen: React.FC = () => {
  const [joke, setJoke] = useState('');

  useEffect(() => {
    // Pick a random joke on mount
    const randomJoke = CHESS_JOKES[Math.floor(Math.random() * CHESS_JOKES.length)];
    setJoke(randomJoke);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 text-center">
      {/* Spinner Container */}
      <div className="relative w-24 h-24 mb-12">
        {/* Outer Ring */}
        <motion.div 
            className="absolute inset-0 border-2 border-neutral-800 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner Spinner */}
        <motion.div 
            className="absolute inset-2 border-t-2 border-white rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Center Piece */}
        <motion.div 
            className="absolute inset-0 flex items-center justify-center text-4xl"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            ♔
        </motion.div>
      </div>

      {/* Loading Text */}
      <h2 className="font-mono text-sm uppercase tracking-[0.3em] text-neutral-500 mb-6 animate-pulse">
        Initializing Strategy...
      </h2>

      {/* The Joke */}
      <AnimatePresence mode="wait">
        <motion.div
            key={joke}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-md"
        >
            <p className="font-serif text-xl md:text-2xl text-white leading-relaxed italic">
                "{joke}"
            </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LoadingScreen;