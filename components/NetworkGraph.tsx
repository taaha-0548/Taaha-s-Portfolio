import React from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../constants';

// A static tree structure: Root -> Categories -> Skills
const TREE_DATA = {
  id: 'root',
  label: 'Strategist',
  x: 50,
  y: 10,
  children: [
    {
      id: 'c1',
      label: 'Systems',
      x: 20,
      y: 40,
      children: [
        { id: 's1', label: 'Distributed', x: 10, y: 70 },
        { id: 's2', label: 'Backend', x: 30, y: 70 },
      ]
    },
    {
      id: 'c2',
      label: 'Theory',
      x: 50,
      y: 40,
      children: [
        { id: 's3', label: 'Algorithms', x: 40, y: 80 },
        { id: 's4', label: 'Graphs', x: 60, y: 80 },
      ]
    },
    {
      id: 'c3',
      label: 'Product',
      x: 80,
      y: 40,
      children: [
        { id: 's5', label: 'UX Arch', x: 70, y: 70 },
        { id: 's6', label: 'React', x: 90, y: 70 },
      ]
    }
  ]
};

const Node = ({ x, y, label, delay, isRoot }: { x: number; y: number; label: string; delay: number; isRoot?: boolean }) => (
  <motion.g
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5, type: 'spring' }}
  >
    <circle 
        cx={`${x}%`} 
        cy={`${y}%`} 
        r={isRoot ? 20 : 12} 
        fill={isRoot ? THEME.colors.gold : '#1c1c1c'} 
        stroke={isRoot ? 'none' : THEME.colors.accent}
        strokeWidth={2}
    />
    <text 
        x={`${x}%`} 
        y={`${y + (isRoot ? 7 : 5)}%`} 
        textAnchor="middle" 
        className="text-[10px] md:text-xs font-mono fill-white"
        dy={isRoot ? "1.5em" : "1.8em"}
        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
    >
      {label}
    </text>
  </motion.g>
);

const Connection = ({ x1, y1, x2, y2, delay }: { x1: number; y1: number; x2: number; y2: number; delay: number }) => (
  <motion.line
    x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
    stroke={THEME.colors.border}
    strokeWidth="1"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 1 }}
    transition={{ delay, duration: 0.8 }}
    style={{ stroke: THEME.colors.accent, strokeOpacity: 0.4 }}
  />
);

const NetworkGraph: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#1c1c1c] relative overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, ${THEME.colors.gold} 1px, transparent 0)`,
            backgroundSize: '40px 40px' 
        }}></div>

        <svg className="w-full h-full max-w-2xl max-h-[600px] z-10">
           {/* Recursive rendering of connections first */}
           {TREE_DATA.children.map((cat, i) => (
                <React.Fragment key={cat.id}>
                    <Connection x1={TREE_DATA.x} y1={TREE_DATA.y} x2={cat.x} y2={cat.y} delay={0.2} />
                    {cat.children.map((skill, j) => (
                         <Connection key={skill.id} x1={cat.x} y1={cat.y} x2={skill.x} y2={skill.y} delay={0.5 + j * 0.1} />
                    ))}
                </React.Fragment>
           ))}

           {/* Nodes */}
           <Node x={TREE_DATA.x} y={TREE_DATA.y} label={TREE_DATA.label} delay={0} isRoot />
           
           {TREE_DATA.children.map((cat, i) => (
               <React.Fragment key={cat.id}>
                   <Node x={cat.x} y={cat.y} label={cat.label} delay={0.3 + i * 0.1} />
                   {cat.children.map((skill, j) => (
                       <Node key={skill.id} x={skill.x} y={skill.y} label={skill.label} delay={0.6 + j * 0.1} />
                   ))}
               </React.Fragment>
           ))}
        </svg>

        <div className="absolute bottom-8 left-8 p-6 bg-black/60 backdrop-blur-sm border-l-2" style={{ borderColor: THEME.colors.gold }}>
            <h2 className="font-serif text-2xl mb-1 text-white">The Blueprint</h2>
            <p className="font-mono text-xs text-gray-400 max-w-sm">
                A hierarchical breakdown of competencies. Rooted in Strategy, branching into Theory and Systems.
            </p>
        </div>
    </div>
  );
};

export default NetworkGraph;