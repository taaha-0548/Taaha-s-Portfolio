import React, { useRef, useEffect } from 'react';
import { MoveItem, MoveType } from '../types';
import { THEME } from '../constants';
import { Download, Save } from 'lucide-react';

interface MoveListProps {
  moves: MoveItem[];
  currentMoveId: string;
  onSelectMove: (move: MoveItem) => void;
}

const MoveList: React.FC<MoveListProps> = ({ moves, currentMoveId, onSelectMove }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current) {
        activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentMoveId]);

  return (
    <div className="w-full h-full bg-[#1e1e1e] flex flex-col border-l border-neutral-800 shadow-xl">
      {/* Header */}
      <div className="p-5 border-b border-neutral-800 bg-[#232323] flex justify-between items-center sticky top-0 z-20">
        <div>
            <h3 className="font-serif text-lg text-white">Notation</h3>
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Portfolio.pgn</span>
        </div>
        
        {/* Resume "Safety Net" */}
        <button 
            className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-neutral-700 rounded text-[10px] font-mono text-gray-300 hover:text-white hover:border-[#e9c46a] transition-all group"
            onClick={() => alert('Downloading Resume...')}
        >
            <Download size={12} className="group-hover:text-[#e9c46a]" />
            <span>Export PGN</span>
        </button>
      </div>

      {/* List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-0 scroll-smooth">
        {moves.map((move, index) => {
            const isActive = move.id === currentMoveId;
            // Determine border color based on type for a subtle hint
            let accentColor = 'transparent';
            if (move.type === MoveType.PROJECT) accentColor = THEME.colors.accent;
            if (move.type === MoveType.EXPERIENCE) accentColor = THEME.colors.gold;
            if (move.type === MoveType.SOCIAL) accentColor = THEME.colors.terracotta;
            
            return (
                <button
                    key={move.id}
                    ref={isActive ? activeRef : null}
                    onClick={() => onSelectMove(move)}
                    className={`w-full text-left group flex items-stretch border-b border-neutral-800/50 transition-all duration-200
                        ${isActive ? 'bg-[#252525]' : 'hover:bg-[#252525]'}
                    `}
                >
                    {/* Notation Column */}
                    <div className="w-16 p-4 font-mono font-medium text-xs text-right border-r border-neutral-800 text-gray-500 pt-5 group-hover:text-gray-300 transition-colors">
                        {move.notation}
                    </div>
                    
                    {/* Details Column */}
                    <div className="flex-1 p-4 relative pl-5">
                        <div className={`font-serif text-base transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                            {move.title}
                        </div>
                        <div className="text-[10px] text-gray-600 font-mono mt-1 uppercase tracking-wider flex items-center gap-2">
                            {move.type === MoveType.PROJECT && <div className="w-1.5 h-1.5 bg-[#2a9d8f] rounded-full"></div>}
                            {move.type === MoveType.EXPERIENCE && <div className="w-1.5 h-1.5 bg-[#e9c46a] rounded-full"></div>}
                            {move.type}
                        </div>
                        
                        {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: accentColor !== 'transparent' ? accentColor : '#fff' }}></div>
                        )}
                    </div>
                </button>
            );
        })}
      </div>
    </div>
  );
};

export default MoveList;