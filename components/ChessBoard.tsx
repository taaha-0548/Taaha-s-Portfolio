import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { motion, AnimatePresence } from 'framer-motion';
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
  onSelectItem?: (item: PortfolioItem) => void;
  categories?: Record<CategoryType, any>;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  activeCategory,
  activeItem,
  onSelectCategory,
  hoveredCategory,
  onSelectItem,
  categories
}) => {
  const [manualMoves, setManualMoves] = useState<Record<string, [number, number]>>({});
  const [capturedPieces, setCapturedPieces] = useState<Set<string>>(new Set());
  const [promotedPieces, setPromotedPieces] = useState<Record<string, string>>({});
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<Set<string>>(new Set());
  const [game, setGame] = useState(() => new Chess());
  const [isCustomGameActive, setIsCustomGameActive] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  // Counter: how many incoming state changes should we absorb without resetting.
  // We use a counter (not boolean) because App.tsx sometimes fires TWO state changes
  // per navigation (null→cat with a 400ms delay when switching categories).
  const boardTriggeredNav = useRef(0);
  // Track previous category to detect sidebar category switches vs item toggles
  const prevCategoryRef = useRef<CategoryType | null>(null);
  const prevItemRef = useRef<PortfolioItem | null>(null);

  // Derive turn directly from chess.js — single source of truth, never desyncs
  const turn = game.turn(); // 'w' or 'b'

  // Helper coordinate conversions
  const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];
  const toAlgebraic = (r: number, c: number) => `${FILES[c]}${RANKS[r]}`;
  const getPieceIdAt = (r: number, c: number, currentMap: Map<string, [number, number]>) => {
      for (const [id, pos] of currentMap.entries()) {
          if (pos[0] === r && pos[1] === c && !capturedPieces.has(id)) return id;
      }
      return null;
  };

  // React to navigation state changes.
  useEffect(() => {
    const categoryActuallyChanged = activeCategory !== prevCategoryRef.current;
    
    // Always track previous values
    prevCategoryRef.current = activeCategory;
    prevItemRef.current = activeItem;

    // Case 1: Board-originated navigation. Decrement counter and absorb.
    if (boardTriggeredNav.current > 0) {
        boardTriggeredNav.current--;
        return;
    }

    // Case 2: Custom game is active and category didn't change. Preserve the game.
    if (isCustomGameActive && !categoryActuallyChanged) {
        return;
    }

    // Case 2.5: Navigation Mode item closing.
    // If the category didn't change, but we are just closing an item to view the menu,
    // we purposefully ABORT the reset to prevent the pieces from sliding backward illegally!
    // The board will act as a 'Visual History' until a new item or category is clicked.
    if (!isCustomGameActive && !categoryActuallyChanged && !activeItem && prevItemRef.current) {
        return;
    }

    // Case 3: Sidebar navigation — category was selected or switched.
    // Full board reset.
    setIsCustomGameActive(false);
    const newGame = new Chess();
    const newMoves: Record<string, [number, number]> = {};
    setCapturedPieces(new Set());
    setPromotedPieces({});
    setSelectedPieceId(null);

    if (activeCategory) {
        const whiteConf = MOVE_CONFIG[activeCategory]?.white;
        if (whiteConf) {
            const p = INITIAL_PIECES.find(p => p.id === whiteConf.pieceId);
            if (p) {
                try {
                    newGame.move({ 
                        from: toAlgebraic(p.startPos[0], p.startPos[1]), 
                        to: toAlgebraic(whiteConf.to[0], whiteConf.to[1]), 
                        promotion: 'q' 
                    });
                    // Track this as a manual move so piece stays even if item closes
                    newMoves[whiteConf.pieceId] = whiteConf.to;
                } catch(e) { /* invalid config move, skip */ }
            }
        }
        
        if (activeItem) {
            const blackConf = activeItem.chessMove || MOVE_CONFIG[activeCategory]?.black;
            if (blackConf) {
                const p = INITIAL_PIECES.find(p => p.id === blackConf.pieceId);
                if (p) {
                    try {
                        newGame.move({ 
                            from: toAlgebraic(p.startPos[0], p.startPos[1]), 
                            to: toAlgebraic(blackConf.to[0], blackConf.to[1]), 
                            promotion: 'q' 
                        });
                        newMoves[blackConf.pieceId] = blackConf.to;
                    } catch(e) { /* invalid config move, skip */ }
                }
            }
        }
    }
    setManualMoves(newMoves);
    setGame(newGame);
  }, [activeCategory, activeItem]);

  const resetBoard = () => {
    const newGame = new Chess();
    setGame(newGame);
    setManualMoves({});
    setCapturedPieces(new Set());
    setPromotedPieces({});
    setSelectedPieceId(null);
    setIsCustomGameActive(false);
  };

  // Master Move Executor (maps a drop or click to logical outcomes)
  const executeMove = (pieceId: string, row: number, col: number, currentMap: Map<string, [number, number]>) => {
      const fromPos = currentMap.get(pieceId);
      if (!fromPos) return;

      // Verify it's this color's turn
      const isWhitePiece = pieceId.startsWith('w');
      if ((turn === 'w' && !isWhitePiece) || (turn === 'b' && isWhitePiece)) return;

      try {
          const moveData = game.move({ 
              from: toAlgebraic(fromPos[0], fromPos[1]), 
              to: toAlgebraic(row, col), 
              promotion: 'q' 
          });

          // Move is legal! Update visual state.
          const updatedGame = new Chess(game.fen());
          setGame(updatedGame);
          setManualMoves(prev => ({ ...prev, [pieceId]: [row, col] }));
          setSelectedPieceId(null);
          setIsCustomGameActive(true);

          // Handle captures
          if (moveData.captured) {
              const capRow = moveData.flags.includes('e') 
                  ? (moveData.color === 'w' ? row + 1 : row - 1) 
                  : row;
              const capId = getPieceIdAt(capRow, col, currentMap);
              if (capId) {
                  setCapturedPieces(prev => new Set(prev).add(capId));
              }
          }

          // Handle castling — move the rook too
          if (moveData.flags.includes('k') || moveData.flags.includes('q')) {
              const isKingside = moveData.flags.includes('k');
              const rookRow = isWhitePiece ? 7 : 0;
              const rookFromCol = isKingside ? 7 : 0;
              const rookToCol = isKingside ? 5 : 3;
              const rookId = isWhitePiece 
                  ? `w-major-${rookFromCol}` 
                  : `b-major-${rookFromCol}`;
              setManualMoves(prev => ({ ...prev, [rookId]: [rookRow, rookToCol] }));
          }

          // Handle Promotion visually
          if (moveData.flags.includes('p') || moveData.flags.includes('np') || moveData.flags.includes('cp')) {
              setPromotedPieces(prev => ({ ...prev, [pieceId]: moveData.color === 'w' ? 'Q' : 'q' }));
          }

          // Portfolio interaction — only trigger on the VERY FIRST move of each color
          // so we don't spam the sidebar on every subsequent move
          const historyLength = updatedGame.history().length;
          
          if (isWhitePiece && historyLength === 1) {
              // White's first move — map to category
              let mappedCat: CategoryType | null = null;
              Object.entries(MOVE_CONFIG).forEach(([cat, config]) => {
                  if (config.white.pieceId === pieceId && config.white.to[0] === row && config.white.to[1] === col) {
                      mappedCat = cat as CategoryType;
                  }
              });

              // Signal that WE are about to change the nav state.
              // App.tsx may fire 1 or 2 state updates depending on whether it's
              // a first selection or a category switch. Use 2 + timeout safety.
              boardTriggeredNav.current = 2;
              setTimeout(() => { boardTriggeredNav.current = 0; }, 800);

              if (mappedCat) onSelectCategory(mappedCat);
              else {
                  const keys = Object.keys(MOVE_CONFIG) as CategoryType[];
                  onSelectCategory(keys[Math.floor(Math.random() * keys.length)]);
              }
          } else if (!isWhitePiece && historyLength === 2 && onSelectItem && activeCategory && categories) {
              // Black's first move — map to item
              boardTriggeredNav.current = 1;
              setTimeout(() => { boardTriggeredNav.current = 0; }, 800);

              let mappedItem: PortfolioItem | null = null;
              const catData = categories[activeCategory];
              if (catData && catData.items) {
                  catData.items.forEach((item: any) => {
                      if (item.chessMove?.pieceId === pieceId && item.chessMove?.to[0] === row && item.chessMove?.to[1] === col) {
                          mappedItem = item;
                      }
                  });
              }

              if (mappedItem) onSelectItem(mappedItem);
              else if (catData && catData.items.length > 0) {
                  onSelectItem(catData.items[Math.floor(Math.random() * catData.items.length)]);
              }
          }
      } catch(e) {
          // Move rejected by engine — piece rubber-bands back via dragSnapToOrigin
          setSelectedPieceId(null);
      }
  };

  // Calculate current position of all pieces based on state
  const currentPieces = useMemo(() => {
    const positions = new Map<string, [number, number]>(); // Map pieceId to [row, col]

    // Default positions
    INITIAL_PIECES.forEach(p => positions.set(p.id, p.startPos));

    // Manual overrides
    Object.entries(manualMoves).forEach(([id, pos]) => positions.set(id, pos as [number, number]));

    // Only force standard layout overrides if we are NOT in a custom physical game
    if (!isCustomGameActive && activeCategory) {
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
  }, [activeCategory, activeItem, manualMoves, isCustomGameActive]);

  // Update legal moves whenever selection or game state changes
  useEffect(() => {
    if (!selectedPieceId) {
        setLegalMoves(new Set());
        return;
    }

    const pos = currentPieces.get(selectedPieceId);
    if (!pos) {
        setLegalMoves(new Set());
        return;
    }

    const algebraic = toAlgebraic(pos[0], pos[1]);
    const moves = game.moves({ square: algebraic as any, verbose: true });
    setLegalMoves(new Set(moves.map(m => m.to)));
  }, [selectedPieceId, game, currentPieces]);

  // Framer Motion Drag Resolver
  const handlePointerDragEnd = (e: any, info: any, pieceId: string) => {
      if (!boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      const dropX = info.point.x;
      const dropY = info.point.y;
      
      // Check if drop occurred strictly within the board boundaries
      if (dropX >= rect.left && dropX <= rect.right && dropY >= rect.top && dropY <= rect.bottom) {
          const squareSize = rect.width / 8; // Assumes perfectly square aspect-ratio board
          const col = Math.floor((dropX - rect.left) / squareSize);
          const row = Math.floor((dropY - rect.top) / squareSize);
          executeMove(pieceId, row, col, currentPieces);
      }
  };

  // Click-to-Move Resolver
  const attemptClickInteraction = (rowIndex: number, colIndex: number, pieceIdAtSquare?: string) => {
      // 1. Tapping a friendly piece to select it
      if (pieceIdAtSquare) {
          const isWhite = pieceIdAtSquare.startsWith('w');
          if ((turn === 'w' && isWhite) || (turn === 'b' && !isWhite)) {
              if (selectedPieceId === pieceIdAtSquare) setSelectedPieceId(null);
              else setSelectedPieceId(pieceIdAtSquare);
              return;
          }
      }

      // 2. Tapping a destination square (empty or enemy) executing the queued move
      if (selectedPieceId) {
          executeMove(selectedPieceId, rowIndex, colIndex, currentPieces);
      }
  };


  // Helper to check if a piece should pulse (when category is hovered)
  const shouldPiecePulse = (pieceId: string) => {
    if (!hoveredCategory || activeCategory) return false;
    const move = MOVE_CONFIG[hoveredCategory];
    return move && (move.white.pieceId === pieceId || move.black.pieceId === pieceId);
  };

  // Highlight logic for squares — uses ACTUAL piece positions, not hardcoded config
  const getHighlight = (r: number, c: number) => {
    // 1. Check and Checkmate Priority
    if (game.isCheck() || game.isCheckmate()) {
        const kingId = game.turn() === 'w' ? 'w-major-4' : 'b-major-4';
        const kingPos = currentPieces.get(kingId);
        if (kingPos && kingPos[0] === r && kingPos[1] === c) {
            return game.isCheckmate() ? 'checkmate' : 'check';
        }
    }

    if (!activeCategory || isCustomGameActive) return null;
    const move = MOVE_CONFIG[activeCategory];

    // Highlight White's current position (where the piece actually is)
    const whitePos = currentPieces.get(move.white.pieceId);
    if (whitePos && whitePos[0] === r && whitePos[1] === c) return 'white';

    // Highlight Black's current position if item active
    if (activeItem) {
      const blackPieceId = activeItem.chessMove?.pieceId || move.black.pieceId;
      const blackPos = currentPieces.get(blackPieceId);
      if (blackPos && blackPos[0] === r && blackPos[1] === c) return 'black';
    }

    return null;
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative select-none">
      {/* Board Container: Responsive sizing that adapts to viewport */}
      <div className="relative aspect-square w-[min(80vw,calc(100vh-120px))] md:w-auto md:h-full md:max-w-full md:max-h-full shadow-2xl rounded-sm overflow-hidden border border-[#2A2A2A] sm:border-2 md:border-4 lg:border-8">
        <div ref={boardRef} className="grid grid-rows-8 h-full w-full relative select-none">
          {[...Array(8)].map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-8 h-full w-full">
              {[...Array(8)].map((_, colIndex) => {
                const isBlackSquare = (rowIndex + colIndex) % 2 === 1;
                const squareColor = isBlackSquare ? 'bg-[#404040]' : 'bg-[#E5E5E5]';
                let highlight = getHighlight(rowIndex, colIndex);

                // Find piece at this square (excluding captured pieces)
                const pieceAtSquare = INITIAL_PIECES.find(p => {
                  if (capturedPieces.has(p.id)) return false;
                  const pos = currentPieces.get(p.id);
                  return pos && pos[0] === rowIndex && pos[1] === colIndex;
                });

                // Light up selected piece square for click-to-move
                if (pieceAtSquare && pieceAtSquare.id === selectedPieceId) {
                  highlight = 'white'; 
                }

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => attemptClickInteraction(rowIndex, colIndex, pieceAtSquare?.id)}
                    className={`relative flex items-center justify-center text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl
                      ${squareColor}
                      ${highlight === 'white' ? 'ring-inset ring-1 sm:ring-2 md:ring-4 ring-[#C5A059]' : ''}
                      ${highlight === 'black' ? 'ring-inset ring-1 sm:ring-2 md:ring-4 ring-[#2A9D8F]' : ''}
                      ${highlight === 'check' ? 'ring-inset ring-2 sm:ring-4 ring-red-500/80 bg-red-500/30' : ''}
                      ${highlight === 'checkmate' ? 'ring-inset ring-4 sm:ring-8 ring-red-600 bg-red-600/50 shadow-[inset_0_0_50px_rgba(220,38,38,0.5)]' : ''}
                    `}
                  >
                    {/* Legal Move Indicator (Dot or Ring) */}
                    {legalMoves.has(toAlgebraic(rowIndex, colIndex)) && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                            {pieceAtSquare ? (
                                // Capture Ring
                                <div className="w-[85%] h-[85%] border-[3px] border-black/10 sm:border-[5px] md:border-[7px] rounded-full" />
                            ) : (
                                // Move Dot
                                <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-black/10 rounded-full" />
                            )}
                        </div>
                    )}

                    {/* Render Piece if it exists at this location */}
                    {pieceAtSquare && (() => {
                        const pieceType = promotedPieces[pieceAtSquare.id] || pieceAtSquare.type;

                        return (
                      <motion.span
                        layoutId={pieceAtSquare.id} // This is the magic prop for movement animation
                        animate={shouldPiecePulse(pieceAtSquare.id) ? {
                            scale: [1, 1.15, 1],
                            opacity: [1, 0.7, 1]
                        } : {}}
                        drag={((turn === 'w' && pieceAtSquare.id.startsWith('w')) || (turn === 'b' && !pieceAtSquare.id.startsWith('w')))}
                        dragSnapToOrigin={true}
                        dragElastic={0.2}
                        onDragStart={() => setSelectedPieceId(pieceAtSquare.id)}
                        onDragEnd={(e, info) => handlePointerDragEnd(e, info, pieceAtSquare.id)}
                        transition={{
                          // Spring transition for the layoutId movement
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.8,
                          layout: { duration: 0.4 }, // faster layout snap
                          scale: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
                          opacity: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className={`relative z-10 select-none font-serif touch-none
                            ${pieceType === pieceType.toUpperCase() ? 'text-[#FAFAFA]' : 'text-black'}
                            ${((turn === 'w' && pieceAtSquare.id.startsWith('w')) || (turn === 'b' && !pieceAtSquare.id.startsWith('w'))) ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed'}
                        `}
                        style={{
                          filter: pieceType === pieceType.toUpperCase()
                            ? 'drop-shadow(0px 2px 1px rgba(0,0,0,0.6))'
                            : 'drop-shadow(0px 1px 0px rgba(255,255,255,0.3))'
                        }}
                      >
                        {PIECES[pieceType]}
                      </motion.span>
                    )})()}

                    {/* Move Grade Symbols (chess.com style) — renders on the piece's actual square */}
                    <AnimatePresence>
                      {activeItem && !isCustomGameActive && highlight === 'black' && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -top-1 -right-1 md:-top-2 md:-right-2 z-20"
                        >
                          {activeItem.moveGrade === 'BRILLIANT' && (
                            <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-[#26D5CE] flex items-center justify-center shadow-lg border-2 border-white/20">
                              <span className="text-white text-[10px] md:text-sm font-bold leading-none">!!</span>
                            </div>
                          )}
                          {activeItem.moveGrade === 'BEST' && (
                            <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-[#98BC4B] flex items-center justify-center shadow-lg border-2 border-white/20">
                              <svg viewBox="0 0 24 24" className="w-3 h-3 md:w-5 md:h-5 text-white fill-current">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </div>
                          )}
                          {activeItem.moveGrade === 'GREAT' && (
                            <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-[#5B8BB0] flex items-center justify-center shadow-lg border-2 border-white/20">
                              <span className="text-white text-[10px] md:text-sm font-bold leading-none">!</span>
                            </div>
                          )}
                          {activeItem.moveGrade === 'GOOD' && (
                            <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-[#98BC4B] flex items-center justify-center shadow-lg border-2 border-white/20 opacity-80">
                              <div className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-white rounded-full"></div>
                            </div>
                          )}
                          {activeItem.moveGrade === 'INACCURACY' && (
                            <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-[#F4BF34] flex items-center justify-center shadow-lg border-2 border-white/20">
                              <span className="text-white text-[10px] md:text-sm font-bold leading-none">?!</span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

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

        {/* Turn Status Indicator to help users understand Drag Permissions */}
        <div className="absolute top-0 right-0 m-2 sm:m-4 px-2 sm:px-3 py-1 bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 rounded-full shadow-lg pointer-events-none z-30 flex items-center gap-2">
            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${turn === 'w' ? 'bg-[#FAFAFA] shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-neutral-600 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]'}`} />
            <span className="text-[10px] sm:text-xs font-mono text-white/90">
                {turn === 'w' ? 'White to move' : 'Black to move'}
            </span>
        </div>

        {/* Checkmate Overlay */}
        <AnimatePresence>
            {game.isCheckmate() && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8"
                >
                    <motion.div
                        initial={{ scale: 0.8, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        className="bg-neutral-900/90 border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl text-center max-w-sm w-full overflow-hidden relative"
                    >
                        {/* Decorative background pulse */}
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute inset-0 bg-red-500 rounded-full blur-3xl -z-10"
                        />

                        <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">
                            Checkmate
                        </h2>
                        <p className="text-neutral-400 font-mono text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed">
                            The king has fallen. <br/>
                            {game.turn() === 'w' ? 'Black' : 'White'} has achieved total victory.
                        </p>

                        <button
                            onClick={resetBoard}
                            className="w-full py-3 sm:py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors shadow-lg active:scale-95 duration-200"
                        >
                            Reset Game
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default ChessBoard;