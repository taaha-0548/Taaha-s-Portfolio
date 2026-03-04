import { Category, CategoryType } from './types';

export const THEME = {
  colors: {
    background: '#1A1A1A', // Matte Charcoal
    surface: '#252525',    // Deep Slate
    surfaceHighlight: '#2F2F2F',
    accent: '#C5A059',     // Antique Gold (Primary Interaction)
    secondaryAccent: '#2A9D8F', // Muted Teal (Visual Interest)
    textPrimary: '#FFFFFF',
    textSecondary: '#888888', // Faint Grey
    border: '#333333',
    borderGold: 'rgba(197, 160, 89, 0.2)', // Faint Gold Border
    gold: '#C5A059',
    terracotta: '#E76F51',
  }
};

export const CHESS_JOKES = [
  "Why did the chess player buy a lamp? He wanted a brighter future for his knights.",
  "Calculated risk: Moving the King to e2.",
  "Why are chess pieces poor? Because the pawn shop only offers small change.",
  "I had dinner with a chess champion. It took him 20 minutes to pass the salt.",
  "Life is like chess. I don't know how to play chess.",
  "Compiling assets... Checking for mate in 3...",
  "Why don't chess players like to eat at restaurants? Because of the checkered tablecloths."
];

// Centralized Assets
export const PROFILE_IMAGE_URL = "/profile.jpg";

export const SOCIAL_LINKS = {
  github: "https://github.com/taaha-0548",
  linkedin: "https://www.linkedin.com/in/muhammad-taaha-6ba8b7286/"
};

/**
 * PORTFOLIO CONTENT CONFIGURATION
 * 
 * Order of Moves:
 * 1. e4: Projects
 * 2. d4: Research and writings
 * 3. Nc3: Socials
 * 4. c4: Interests
 * 5. Nf3: About me
 * 6. f4: Achievement/Leadership
 */
export const CATEGORIES: Record<CategoryType, Category> = {
  PROJECTS: {
    id: 'PROJECTS',
    label: 'Projects',
    notation: '1. e4',
    pieceType: 'Queen',
    description: 'Major implementations.',
    items: [
      {
        id: 'p1',
        title: 'Stack',
        subtitle: 'Digital Social Card App',
        description: 'Production-grade Android application for selective QR-based sharing of social profiles with offline-first local data persistence.',
        techStack: ['React', 'TypeScript', 'Capacitor', 'Vite'],
        imageUrl: 'https://picsum.photos/800/600?grayscale',
        badges: ['Play Store Live'],
        complexityScore: 9.0,
        link: 'https://play.google.com/store/apps/details?id=com.stackcard.app',
        // Sicilian Defense (c5)
        chessMove: { pieceId: 'bp-2', to: [3, 2] }
      },
      {
        id: 'p2',
        title: 'Guardian',
        subtitle: 'Safety App',
        description: 'Real-time geospatial safety tracking with emergency offline mode.',
        techStack: ['React Native', 'Mapbox'],
        imageUrl: 'https://picsum.photos/800/602?grayscale',
        badges: ['400+ Users'],
        complexityScore: 7.0,
        link: 'https://github.com/username/guardian',
        // French Defense (e6)
        chessMove: { pieceId: 'bp-4', to: [2, 4] }
      },
      {
        id: 'p3',
        title: 'p2pdocs',
        subtitle: 'Distributed Editor',
        description: 'CRDT-based real-time collaboration tool over UDP/TCP.',
        techStack: ['Python', 'Networking'],
        badges: ['PyPI'],
        complexityScore: 9.2,
        link: 'https://github.com/username/p2pdocs',
        // Caro-Kann (c6)
        chessMove: { pieceId: 'bp-2', to: [2, 2] }
      }
    ]
  },
  RESEARCH: {
    id: 'RESEARCH',
    label: 'Research',
    notation: '1. d4',
    pieceType: 'Bishop',
    description: 'Theory & Publications.',
    items: [
      {
        id: 'r1',
        title: 'P vs NP',
        subtitle: 'Complexity Theory',
        description: 'Analysis of polynomial time verification vs execution. Explored implications in cryptography.',
        techStack: ['Latex', 'Math'],
        complexityScore: 9.5,
        // King's Indian Defense (Nf6)
        chessMove: { pieceId: 'b-major-6', to: [2, 5] }
      },
      {
        id: 'r2',
        title: 'Consensus Algos',
        subtitle: 'Distributed Systems',
        description: 'Comparative study of Paxos vs Raft in high-latency environments.',
        complexityScore: 8.5,
        // Queen's Gambit Declined (d5)
        chessMove: { pieceId: 'bp-3', to: [3, 3] }
      }
    ]
  },
  SOCIALS: {
    id: 'SOCIALS',
    label: 'Socials',
    notation: '1. Nc3',
    pieceType: 'Knight',
    description: 'Connect & Network.',
    items: [
      {
        id: 'soc1',
        title: 'LinkedIn',
        subtitle: 'Professional',
        description: 'Follow my career updates and professional network.',
        link: SOCIAL_LINKS.linkedin,
        complexityScore: 2.0,
        // 1... e5 (Standard Open Game)
        chessMove: { pieceId: 'bp-4', to: [3, 4] }
      },
      {
        id: 'soc2',
        title: 'GitHub',
        subtitle: 'Code',
        description: 'Review my open source contributions and repositories.',
        link: SOCIAL_LINKS.github,
        complexityScore: 8.0,
        // 1... d5 (Center Counter)
        chessMove: { pieceId: 'bp-3', to: [3, 3] }
      },
      {
        id: 'soc3',
        title: 'Medium',
        subtitle: 'Blog',
        description: 'Read my thoughts on engineering, strategy, and chess.',
        link: 'https://medium.com',
        complexityScore: 4.0,
        // 1... c5 (Sicilian Style)
        chessMove: { pieceId: 'bp-2', to: [3, 2] }
      }
    ]
  },
  INTERESTS: {
    id: 'INTERESTS',
    label: 'Interests',
    notation: '1. c4',
    pieceType: 'Pawn',
    description: 'Hobbies & Passions.',
    items: [
      {
        id: 'i1',
        title: 'Chess',
        subtitle: 'ELO 1800+',
        description: 'Active tournament player. Favorite opening: Sicilian Najdorf.',
        complexityScore: 6.0,
        // 1... e5 (Reverse Sicilian)
        chessMove: { pieceId: 'bp-4', to: [3, 4] }
      },
      {
        id: 'i2',
        title: 'History',
        subtitle: 'Strategy',
        description: 'Studying military strategies of the ancient world.',
        complexityScore: 3.0,
        // 1... c5 (Symmetrical English)
        chessMove: { pieceId: 'bp-2', to: [3, 2] }
      }
    ]
  },
  ABOUT: {
    id: 'ABOUT',
    label: 'About Me',
    notation: '1. Nf3',
    pieceType: 'Rook',
    description: 'The Engineer.',
    items: [
      {
        id: 'ab1',
        title: 'Muhammad Taaha',
        subtitle: 'The Player',
        description: 'CS Student at FAST-NUCES. Passionate about graph theory, distributed systems, and architecting solutions that scale.',
        complexityScore: 1.0,
        imageUrl: PROFILE_IMAGE_URL,
        // 1... d5 (Reti Gambit)
        chessMove: { pieceId: 'bp-3', to: [3, 3] }
      },
      {
        id: 'ab2',
        title: 'Tech Stack',
        description: 'Proficient in Python, TS, JS, C++, Java. Frameworks include React.js, Node.js, PostgreSQL, Docker, AWS.',
        techStack: ['Python', 'TS', 'React', 'AWS'],
        complexityScore: 7.0,
        // 1... g6 (King's Indian Setup)
        chessMove: { pieceId: 'bp-6', to: [2, 6] }
      }
    ]
  },
  LEADERSHIP: {
    id: 'LEADERSHIP',
    label: 'Leadership',
    notation: '1. f4',
    pieceType: 'King',
    description: 'Achievements & Goals.',
    items: [
      {
        id: 'l1',
        title: 'Coders Cup 2025',
        subtitle: 'Head / Lead Organizer',
        description: 'Directed a cross-functional team of 30+ to deliver a nationwide competitive programming event for 1,000+ participants.',
        badges: ['Leadership', '1,000+ Participants'],
        complexityScore: 9.0,
        // 1... d5 (Classical Dutch/Bird)
        chessMove: { pieceId: 'bp-3', to: [3, 3] }
      },
      {
        id: 'l2',
        title: 'Staff Engineer Goal',
        subtitle: 'Vision',
        description: 'Aspiring to architect systems that serve millions.',
        complexityScore: 10.0,
        // 1... e5 (From's Gambit - Aggressive)
        chessMove: { pieceId: 'bp-4', to: [3, 4] }
      }
    ]
  }
};