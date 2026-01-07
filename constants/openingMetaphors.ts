import { CategoryType } from '../types';

interface OpeningInfo {
  name: string;
  notation: string;
  metaphor: string;
  description: string;
}

export const OPENING_METAPHORS: Record<CategoryType, OpeningInfo> = {
  PROJECTS: {
    name: "King's Pawn Opening",
    notation: "1. e4",
    metaphor: "Bold & Direct",
    description: "The most popular opening in chess - aggressive and straightforward. Like my projects, it controls the center and creates immediate impact."
  },
  RESEARCH: {
    name: "Queen's Pawn Opening",
    notation: "1. d4",
    metaphor: "Strategic & Methodical",
    description: "A solid, strategic approach focusing on long-term positional advantages. Represents deep research and systematic problem-solving."
  },
  SOCIALS: {
    name: "Queen's Knight Opening",
    notation: "1. Nc3",
    metaphor: "Flexible & Connected",
    description: "The knight develops early, creating connections across the board. Symbolizes networking and building professional relationships."
  },
  INTERESTS: {
    name: "English Opening",
    notation: "1. c4",
    metaphor: "Creative & Unconventional",
    description: "A hypermodern opening that controls the center from the flanks. Represents creative problem-solving and unique approaches."
  },
  ABOUT: {
    name: "Réti Opening",
    notation: "1. Nf3",
    metaphor: "Adaptive & Versatile",
    description: "A flexible opening that can transpose into many structures. Like my skillset, it adapts to various situations and requirements."
  },
  LEADERSHIP: {
    name: "Bird's Opening",
    notation: "1. f4",
    metaphor: "Ambitious & Bold",
    description: "An aggressive, somewhat risky opening that aims for quick kingside attacks. Represents ambitious leadership and taking calculated risks."
  }
};
