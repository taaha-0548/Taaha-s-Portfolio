
export type Page = 'LANDING' | 'HUB' | 'BLOG' | 'ABOUT';

export type CategoryType = 'PROJECTS' | 'RESEARCH' | 'SOCIALS' | 'INTERESTS' | 'ABOUT' | 'LEADERSHIP';

export interface PortfolioItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  techStack?: string[];
  link?: string;
  imageUrl?: string;
  badges?: string[];
  complexityScore?: number; // 1-10
  chessMove?: {
    pieceId: string; // e.g. 'bp-3'
    to: [number, number]; // [row, col]
  };
}

export interface Category {
  id: CategoryType;
  label: string;
  notation: string; // e.g. "1. e4"
  pieceType: string; // e.g., 'Pawn', 'Knight'
  description: string;
  items: PortfolioItem[];
}

export interface GameState {
  currentPage: Page;
  activeCategory: CategoryType | null;
  activeItem: PortfolioItem | null;
  isResumeOpen: boolean;
}

export enum MoveType {
  PROJECT = 'Project',
  EXPERIENCE = 'Experience',
  SOCIAL = 'Social'
}

export interface MoveItem {
  id: string;
  notation: string;
  title: string;
  type: MoveType;
  description?: string;
  link?: string;
}
