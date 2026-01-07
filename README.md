# The Grandmaster's Log

> "Strategy requires thought, tactics require observation."

**The Grandmaster’s Log** is a strategic portfolio platform that reimagines the developer portfolio as a Chess PGN (Portable Game Notation) viewer. It positions the engineer not just as a coder, but as a **Strategic Architect**.

Your career is **The Game**. Your projects are **The Tactics**. Your research is **The Theory**.

## ♟️ The Core Philosophy

- **The Vibe**: "Heritage Architect." Deep, intellectual, and culturally grounded.
- **The Fusion**: A synthesis of **Modern Systems Engineering** (Terminal fonts, clean lines) and **Desi Heritage** (Geometric Jali patterns, Persian Green & Antique Gold palette).
- **The Interaction**: Non-linear exploration using a "Game Notation" sidebar.

## 🛠️ The Arsenal (Tech Stack)

*   **Core**: React 19 + TypeScript
*   **Styling**: Tailwind CSS (Utility-first architecture)
*   **Motion**: Framer Motion (Complex state transitions & spring animations)
*   **Visualization**: Custom SVG + Framer Motion (Skill Trees & Board rendering)
*   **Icons**: Lucide React

## 🏰 Architecture

The application uses a **Split-Screen PGN Design**:

1.  **Left Pane (The Visual Stage)**: 
    *   Occupies 70% of the screen (Desktop).
    *   **Dynamic Rendering**: Acts as a viewport that morphs based on the selected "move."
    *   *States*: Chessboard -> Strategic Skill Tree -> Project Dashboard -> Reader Mode -> Terminal.
2.  **Right Pane (The Notation)**: 
    *   Occupies 30% of the screen.
    *   **Navigation**: A scrollable list styled as a chess score sheet (e.g., `1. e4`, `1... c5`).
    *   **Random Access**: Users can click any move to jump instantly to that section (no forced linear playback).

## 🚀 Key Features (The Moves)

### Phase 1: The Opening (Landing)
*   **Ambient Board**: A minimalist 2D chessboard with subtle Jali pattern overlays on dark squares.
*   **No Gatekeeper**: The navigation is open immediately; the board serves as an atmospheric entry point rather than a barrier.

### Phase 2: The Middle Game (Profile & Projects)
*   **The Blueprint (About)**: A **Strategic Decision Tree** visualization built with SVG and Framer Motion. It maps competencies hierarchically (Strategy -> Systems/Theory) rather than using a chaotic force-directed graph.
*   **The Tactics (Projects)**: 
    *   **Evaluation Bar**: A vertical bar inspired by chess engines (Stockfish). Instead of "White vs Black," it visualizes the **Impact Score** of the project.
    *   **Metrics**: Key achievements (e.g., "CEO Commended", "Published on PyPI") are highlighted like tactical annotations (`!!`).

### Phase 3: The Endgame (Theory & Socials)
*   **Reader Mode**: A clean, serif-focused layout for displaying research abstracts (e.g., P vs NP analysis).
*   **Social Log**: A terminal-style feed (`socials.log`) displaying professional updates.

### 🧩 Easter Egg (The Puzzle)
*   **Tactical Challenge**: A hidden brain icon in the footer opens a logic puzzle.
*   **Reward**: Solving the puzzle simulates a "Checkmate" state and unlocks the Resume Download.

## 🎨 Design System

The aesthetic shifts away from generic "Cyberpunk Neon" to a warmer, more sophisticated palette:

*   **Background**: Deep Obsidian (`#1c1c1c`) - Softer than pure black.
*   **Primary Accent**: Persian Green (`#2a9d8f`) - Reminiscent of oxidized copper or tiles.
*   **Secondary Accent**: Antique Gold (`#e9c46a`) - Represents prestige and high-value moves.
*   **Typography**: 
    *   *JetBrains Mono*: Code, data, and logic.
    *   *Playfair Display*: Headers, titles, and human elements.

## 📂 Implementation Details

### Data Structure (`constants.ts`)
The entire "game" is data-driven. Adding a new project does not require touching React components.

```typescript
export const MOVES: MoveItem[] = [
  {
    id: 'move-2',
    notation: '1... c5', // The Move
    title: 'Uni-verse',  // The Chapter
    type: MoveType.PROJECT,
    projectData: {
      title: 'Uni-verse',
      evalScore: 9.5, // Controls the Evaluation Bar height
      tags: ['Flask', 'AI'],
      imageUrl: '...'
    }
  },
  // Add infinite moves here
];
```

### Visual Stage (`VisualStage.tsx`)
A switch-case component that mounts specific views based on the `currentMove.visualComponent` or `currentMove.type`. It uses `AnimatePresence` to handle smooth cross-fades between different content types (e.g., fading from a Chessboard to a Project Image).

### Evaluation Bar (`EvaluationBar.tsx`)
Calculates height percentage based on a 0-10 score.
`const heightPercent = Math.min(Math.max((score / 10) * 100, 10), 100);`
It uses a gradient fill (Persian Green to White) to simulate a high-tech gauge.
