import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../constants';
import { CategoryType, PortfolioItem } from '../types';

// Piece Characters
const PIECES: Record<string, string> = {
  'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
  'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

// Types for our internal board logic
interface PieceState {
  id: string; // Unique ID for Framer Motion layoutId (e.g. 'wp-e2')
  type: string; // 'P', 'p', 'K', etc.
  startPos: [number, number]; // [row, col]
}

// Helper to generate initial piece set with IDs
const generatePieces = (): PieceState[] => {
  const pieces: PieceState[] = [];
  
  // Black Major Pieces (Row 0)
  const blackMajors = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
  blackMajors.forEach((type, col) => pieces.push({ id: `b-major-${col}`, type, startPos: [0, col] }));
  
  // Black Pawns (Row 1)
  for (let col = 0; col < 8; col++) pieces.push({ id: `bp-${col}`, type: 'p', startPos: [1, col] });
  
  // White Pawns (Row 6)
  for (let col = 0; col < 8; col++) pieces.push({ id: `wp-${col}`, type: 'P', startPos: [6, col] });
  
  // White Major Pieces (Row 7)
  const whiteMajors = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
  whiteMajors.forEach((type, col) => pieces.push({ id: `w-major-${col}`, type, startPos: [7, col] }));
  
  return pieces;
};

const INITIAL_PIECES = generatePieces();

// Configuration for moves
// Coordinates: [Row, Col]. 0,0 is Top Left (a8). 7,7 is Bottom Right (h1).
const MOVE_CONFIG: Record<CategoryType, { 
    white: { pieceId: string, to: [number, number] }, 
    black: { pieceId: string, to: [number, number] } 
}> = {
    PROJECTS: { 
        // 1. e4 (Projects)
        white: { pieceId: 'wp-4', to: [4, 4] }, // e2 -> e4
        black: { pieceId: 'bp-2', to: [3, 2] }  // c5 response (default if no item selected)
    },
    RESEARCH: {
        // 1. d4 (Research)
        white: { pieceId: 'wp-3', to: [5, 3] }, // d2 -> d4
        black: { pieceId: 'bp-3', to: [3, 3] }  // d5 response
    },
    SOCIALS: {
        // 1. Nc3 (Socials)
        white: { pieceId: 'w-major-1', to: [5, 2] }, // b1 -> c3
        black: { pieceId: 'bp-4', to: [3, 4] }  // e5 response
    },
    INTERESTS: {
        // 1. c4 (Interests - English Opening)
        white: { pieceId: 'wp-2', to: [4, 2] }, // c2 -> c4
        black: { pieceId: 'bp-4', to: [3, 4] }  // e5 response
    },
    ABOUT: {
        // 1. Nf3 (About Me - Reti)
        white: { pieceId: 'w-major-6', to: [5, 5] }, // g1 -> f3
        black: { pieceId: 'bp-3', to: [3, 3] }  // d5 response
    },
    LEADERSHIP: {
        // 1. f4 (Leadership - Bird's Opening)
        white: { pieceId: 'wp-5', to: [4, 5] }, // f2 -> f4
        black: { pieceId: 'bp-4', to: [3, 4] }  // e5 response
    }
};

interface ChessBoardProps {
  activeCategory: CategoryType | null;
  activeItem: PortfolioItem | null;
  onSelectCategory: (cat: CategoryType) => void;
  hoveredCategory?: CategoryType | null;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ 
  activeCategory, 
  activeItem, 
  onSelectCategory,
  hoveredCategory 
}) => {
  
  // Calculate current position of all pieces based on state
  const currentPieces = useMemo(() => {
      const positions = new Map<string, [number, number]>(); // Map pieceId to [row, col]
      
      // Default positions
      INITIAL_PIECES.forEach(p => positions.set(p.id, p.startPos));

      if (activeCategory) {
          const move = MOVE_CONFIG[activeCategory];
          if (move) {
              // Apply White Move
              positions.set(move.white.pieceId, move.white.to);

              if (activeItem) {
                  // Apply Black Move
                  // If item has a specific move defined, use it. Otherwise use category default.
                  if (activeItem.chessMove) {
                    positions.set(activeItem.chessMove.pieceId, activeItem.chessMove.to);
                  } else {
                    positions.set(move.black.pieceId, move.black.to);
                  }
              }
          }
      }
      return positions;
  }, [activeCategory, activeItem]);

  // Helper to check if a piece should pulse (when category is hovered)
  const shouldPiecePulse = (pieceId: string) => {
      if (!hoveredCategory || activeCategory) return false;
      const move = MOVE_CONFIG[hoveredCategory];
      return move && (move.white.pieceId === pieceId || move.black.pieceId === pieceId);
  };

  // Highlight logic for squares
  const getHighlight = (r: number, c: number) => {
      if (!activeCategory) return false;
      const move = MOVE_CONFIG[activeCategory];
      
      // Highlight White's destination
      if (move.white.to[0] === r && move.white.to[1] === c) return 'white';
      
      // Highlight Black's destination if item active
      if (activeItem) {
          if (activeItem.chessMove) {
              if (activeItem.chessMove.to[0] === r && activeItem.chessMove.to[1] === c) return 'black';
          } else {
              if (move.black.to[0] === r && move.black.to[1] === c) return 'black';
          }
      }
      
      return null;
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative p-2 sm:p-4">
      {/* Board Container: Responsive sizing that adapts to viewport */}
      <div className="relative aspect-square w-full max-w-[min(100%,600px)] h-auto max-h-full shadow-2xl rounded-sm overflow-hidden border-2 sm:border-4 md:border-8 border-[#2A2A2A]">
        <div className="grid grid-rows-8 h-full w-full">
          {[...Array(8)].map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-8 h-full w-full">
              {[...Array(8)].map((_, colIndex) => {
                const isBlackSquare = (rowIndex + colIndex) % 2 === 1;
                const squareColor = isBlackSquare ? 'bg-[#404040]' : 'bg-[#E5E5E5]';
                const highlight = getHighlight(rowIndex, colIndex);
                
                // Find piece at this square
                const pieceAtSquare = INITIAL_PIECES.find(p => {
                    const pos = currentPieces.get(p.id);
                    return pos && pos[0] === rowIndex && pos[1] === colIndex;
                });

                return (
                  <div 
                    key={`${rowIndex}-${colIndex}`}
                    className={`relative flex items-center justify-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
                      ${squareColor}
                      ${highlight === 'white' ? 'ring-inset ring-2 md:ring-4 ring-[#C5A059]' : ''}
                      ${highlight === 'black' ? 'ring-inset ring-2 md:ring-4 ring-[#2A9D8F]' : ''}
                    `}
                  >
                    {/* Render Piece if it exists at this location */}
                    {pieceAtSquare && (
                      <motion.span
                        layoutId={pieceAtSquare.id} // This is the magic prop for movement animation
                        transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                        animate={shouldPiecePulse(pieceAtSquare.id) ? {
                            scale: [1, 1.15, 1],
                            opacity: [1, 0.7, 1]
                        } : {}}
                        transition={{
                            scale: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
                            opacity: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className={`relative z-10 select-none font-serif
                            ${pieceAtSquare.type === pieceAtSquare.type.toUpperCase() ? 'text-[#FAFAFA]' : 'text-black'}
                        `}
                        style={{ 
                            filter: pieceAtSquare.type === pieceAtSquare.type.toUpperCase() 
                                ? 'drop-shadow(0px 2px 1px rgba(0,0,0,0.6))' 
                                : 'drop-shadow(0px 1px 0px rgba(255,255,255,0.3))'
                        }}
                      >
                        {PIECES[pieceAtSquare.type]}
                      </motion.span>
                    )}
                    
                    {/* Rank/File Labels (Optional nice touch for PGN viewer vibe) */}
                    {colIndex === 0 && (
                        <span className={`absolute left-0.5 top-0.5 text-[6px] sm:text-[8px] font-mono ${isBlackSquare ? 'text-[#666]' : 'text-[#999]'}`}>
                            {8 - rowIndex}
                        </span>
                    )}
                    {rowIndex === 7 && (
                        <span className={`absolute right-0.5 bottom-0 text-[6px] sm:text-[8px] font-mono ${isBlackSquare ? 'text-[#666]' : 'text-[#999]'}`}>
                            {String.fromCharCode(97 + colIndex)}
                        </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;