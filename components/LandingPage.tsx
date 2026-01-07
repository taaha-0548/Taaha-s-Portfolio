import React from 'react';
import { ArrowRight, FileText, Github, Linkedin } from 'lucide-react';
import { PROFILE_IMAGE_URL, SOCIAL_LINKS } from '../constants';

interface LandingPageProps {
  onStart: () => void;
  onOpenResume: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onOpenResume }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-black relative overflow-hidden selection:bg-white selection:text-black">
        
        {/* Layer 1: Strategic Grid Background (Abstract Chess Board) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
             style={{ 
                 backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', 
                 backgroundSize: '4rem 4rem' 
             }}>
        </div>
        
        {/* Layer 2: Ambient Spotlight (Subtle depth) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Layer 3: Main Content */}
        <div className="relative z-10 max-w-5xl w-full flex flex-col items-center gap-8 md:gap-12">
            
            {/* Profile Image & Socials Wrapper */}
            <div className="flex items-center gap-6 sm:gap-8 md:gap-12">
                
                {/* GitHub (Left) */}
                <a 
                    href={SOCIAL_LINKS.github} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-neutral-500 hover:text-[#A855F7] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                    title="GitHub"
                >
                    <Github size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
                </a>

                {/* Profile Picture */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 rounded-full overflow-hidden border border-neutral-800 shadow-2xl group cursor-pointer">
                    <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
                    <img 
                        src={PROFILE_IMAGE_URL} 
                        alt="Muhammad Taaha"
                        className="relative z-10 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-100 group-hover:scale-110"
                    />
                    {/* Subtle Inner Ring */}
                    <div className="absolute inset-0 rounded-full ring-1 ring-white/10 z-20 pointer-events-none"></div>
                </div>

                {/* LinkedIn (Right) */}
                <a 
                    href={SOCIAL_LINKS.linkedin} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-neutral-500 hover:text-[#0A66C2] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                    title="LinkedIn"
                >
                    <Linkedin size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
                </a>
            </div>

            {/* Hero Typography - High Contrast */}
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-serif font-medium text-white tracking-tighter leading-[0.9] text-center px-4">
                    Muhammad Taaha
                </h1>
                <p className="text-neutral-400 text-base sm:text-lg md:text-xl font-mono tracking-wide">
                    Building Systems, Solving Problems
                </p>
            </div>
            
            {/* Value Proposition */}
            <p className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-2xl font-sans leading-relaxed tracking-wide text-center px-4">
                Computer Science student at FAST-NUCES researching <span className="text-white border-b border-white/20 pb-0.5">algorithmic challenges</span> and contributing to <span className="text-white border-b border-white/20 pb-0.5">open source</span>.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 mt-4 w-full sm:w-auto px-4">
                <button 
                    onClick={onStart}
                    className="w-full sm:w-auto group relative overflow-hidden bg-white text-black px-8 sm:px-10 py-3 sm:py-4 font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        Initialize Game <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
                
                <button 
                    onClick={onOpenResume}
                    className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 border border-neutral-800 text-neutral-400 font-mono text-xs uppercase tracking-widest hover:border-white hover:text-white transition-all flex items-center justify-center gap-3"
                >
                    <FileText size={14} />
                    Export Resume
                </button>
            </div>
        </div>
    </div>
  );
};

export default LandingPage;