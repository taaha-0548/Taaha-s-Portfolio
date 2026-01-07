import React, { useState, useEffect } from 'react';
import { X, MousePointer, Move, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingModalProps {
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to My Chess Portfolio",
      description: "This portfolio is designed as an interactive chess game. Each category represents a different opening move.",
      icon: <Sparkles size={40} className="text-[#C5A059]" />
    },
    {
      title: "Select Categories to Move",
      description: "Click on categories in the Command Center (sidebar) to make your moves. Watch the chess pieces animate on the board!",
      icon: <MousePointer size={40} className="text-[#C5A059]" />,
      highlight: "sidebar"
    },
    {
      title: "Explore Projects & Skills",
      description: "Each move reveals my projects, research, and experience. Click on individual items to see detailed information.",
      icon: <Move size={40} className="text-[#C5A059]" />
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    localStorage.setItem('portfolio-onboarding-completed', 'true');
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('portfolio-onboarding-completed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Spotlight effect pointing to sidebar on step 1 */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-[#C5A059]/5 to-transparent pointer-events-none hidden md:block"
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-[#252525] border border-[#C5A059]/20 w-full max-w-lg p-8 shadow-2xl relative rounded-sm"
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-[#666] hover:text-[#C5A059] transition-colors"
          aria-label="Close tutorial"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            key={step}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
          >
            {steps[step].icon}
          </motion.div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="text-center"
          >
            <h2 className="font-serif text-2xl text-white mb-3">
              {steps[step].title}
            </h2>
            <p className="text-[#AAA] text-sm leading-relaxed mb-8">
              {steps[step].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === step 
                  ? 'w-8 bg-[#C5A059]' 
                  : index < step 
                    ? 'w-4 bg-[#C5A059]/50'
                    : 'w-4 bg-[#333]'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-6 py-3 bg-[#333] hover:bg-[#444] text-white font-mono text-xs uppercase tracking-wider rounded-sm transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-3 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider rounded-sm transition-colors"
          >
            {step === steps.length - 1 ? "Got it!" : "Next"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingModal;
