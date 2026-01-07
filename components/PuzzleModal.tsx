import React, { useState } from 'react';
import { X, Download, Trophy } from 'lucide-react';
import { THEME } from '../constants';

interface PuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PuzzleModal: React.FC<PuzzleModalProps> = ({ isOpen, onClose }) => {
  const [solved, setSolved] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

  if (!isOpen) return null;

  // Hardcoded mini-puzzle: White to move and mate in 1.
  // Board: King on h1, White Queen on g7, Black King on h8. Move Qg7-g8 is mate? No king takes.
  // Setup: White Rook h1, Black King h8. White King f7. Move Rh1-h7 mate? No.
  // Let's do a simple text puzzle or clickable interaction.
  // Let's do a logic gate question since it's "CS".
  // Q: P=True, Q=False. What is (P AND Q) OR (NOT Q)? -> True.
  
  const handleOption = (correct: boolean) => {
    if (correct) setSolved(true);
    else {
        alert("Blunder! Try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-neutral-700 w-full max-w-lg p-8 relative shadow-2xl rounded-sm">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
            <X size={20} />
        </button>

        {!solved ? (
            <div className="text-center">
                <h3 className="font-serif text-2xl text-white mb-2">Tactical Puzzle</h3>
                <p className="font-mono text-sm text-cyan-400 mb-6">White to move. Find the best continuation.</p>
                
                {/* Visual Representation of a logic problem disguised as chess or just a code snippet */}
                <div className="bg-black p-4 rounded font-mono text-left text-sm text-gray-300 mb-6 border border-neutral-800">
                    <p><span className="text-purple-400">const</span> isP = <span className="text-yellow-400">true</span>;</p>
                    <p><span className="text-purple-400">const</span> isNP = <span className="text-yellow-400">false</span>;</p>
                    <p><span className="text-purple-400">if</span> (isP === isNP) <span className="text-blue-400">return</span> 'Draw';</p>
                    <p><span className="text-purple-400">else</span> <span className="text-blue-400">return</span> 'Win';</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleOption(false)} className="py-3 bg-neutral-800 hover:bg-red-900/30 text-white font-mono rounded transition-colors">Draw</button>
                    <button onClick={() => handleOption(true)} className="py-3 bg-neutral-800 hover:bg-green-900/30 text-white font-mono rounded transition-colors">Win</button>
                </div>
            </div>
        ) : (
            <div className="text-center">
                <Trophy size={48} className="text-gold mx-auto mb-4" style={{ color: THEME.colors.gold }} />
                <h3 className="font-serif text-2xl text-white mb-2">Checkmate!</h3>
                <p className="text-neutral-400 text-sm mb-6">You have unlocked the full dossier.</p>
                <a 
                    href="#" 
                    className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded transition-colors"
                    onClick={(e) => { e.preventDefault(); alert("Resume download started..."); onClose(); }}
                >
                    <Download size={18} /> Download Resume
                </a>
            </div>
        )}
      </div>
    </div>
  );
};

export default PuzzleModal;
