import React from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../constants';

interface EvaluationBarProps {
  score: number; // 0 to 10
}

const EvaluationBar: React.FC<EvaluationBarProps> = ({ score }) => {
  const heightPercent = Math.min(Math.max((score / 10) * 100, 10), 100);

  return (
    <div className="h-full w-4 sm:w-6 bg-neutral-900 border border-neutral-700 relative overflow-hidden flex flex-col justify-end rounded-sm shadow-inner">
      <motion.div 
        className="w-full"
        style={{ background: `linear-gradient(to top, ${THEME.colors.accent} 0%, #ffffff 100%)` }}
        initial={{ height: '0%' }}
        animate={{ height: `${heightPercent}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
        <div className="h-[1px] w-full bg-black/20 absolute top-1/2"></div>
      </div>
      <span className="absolute bottom-1 w-full text-center text-[8px] font-mono text-black font-bold mix-blend-screen">
          {score.toFixed(1)}
      </span>
    </div>
  );
};

export default EvaluationBar;