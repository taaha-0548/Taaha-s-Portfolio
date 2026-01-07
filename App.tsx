import React, { useState, useEffect, useRef } from 'react';
import { Page, CategoryType, PortfolioItem } from './types';
import LandingPage from './components/LandingPage';
import VisualStage from './components/VisualStage';
import Sidebar from './components/Sidebar';
import ResumeModal from './components/ResumeModal';
import LoadingScreen from './components/LoadingScreen';
import OnboardingModal from './components/OnboardingModal';
import { usePortfolioData } from './hooks/usePortfolioData';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('LANDING');
  const [activeCategory, setActiveCategory] = useState<CategoryType | null>(null);
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<CategoryType | null>(null);
  
  // Load portfolio data from JSON
  const { categories, isLoading: dataLoading } = usePortfolioData();
  
  // Mobile Nav State
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  // Check if user needs onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('portfolio-onboarding-completed');
    if (!hasSeenOnboarding && currentPage === 'HUB') {
      setShowOnboarding(true);
    }
  }, [currentPage]);

  const handleStartGame = () => {
      setIsLoading(true);
      // Simulate loading time for effect (and to read the joke)
      setTimeout(() => {
          setIsLoading(false);
          handleNavigate('HUB');
      }, 2500);
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setActiveCategory(null);
    setActiveItem(null);
  };

  const handleHome = () => {
      setIsLoading(true);
      // Trigger loading spinner when returning to Landing Page
      setTimeout(() => {
          setIsLoading(false);
          handleNavigate('LANDING');
      }, 2500);
  };

  const handleSelectCategory = (cat: CategoryType) => {
    // If switching categories, reset to starting position first
    if (activeCategory && activeCategory !== cat) {
      // Close any open item
      setActiveItem(null);
      // Reset to starting position
      setActiveCategory(null);
      
      // Wait for animation, then select new category
      setTimeout(() => {
        setActiveCategory(cat);
        setActiveItem(null);
        setIsMobileNavOpen(true);
      }, 400); // Match the chess piece animation duration
    } else {
      // First selection or same category
      setActiveCategory(cat);
      setActiveItem(null);
      setIsMobileNavOpen(true);
    }
  };

  const handleSelectItem = (item: PortfolioItem) => {
    // If switching items, reset to category view first
    if (activeItem && activeItem.id !== item.id) {
      // Close current item
      setActiveItem(null);
      
      // Wait for animation, then show new item
      setTimeout(() => {
        setActiveItem(item);
        setIsMobileNavOpen(false); // Close nav on mobile to show content
      }, 700); // Longer delay to ensure old modal fades out completely
    } else {
      // First item selection
      setActiveItem(item);
      setIsMobileNavOpen(false);
    }
  };

  if (dataLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen w-screen bg-[#1A1A1A] text-white font-sans selection:bg-[#C5A059] selection:text-black overflow-hidden flex flex-col">
      
      {/* Loading Overlay */}
      {isLoading && <LoadingScreen />}

      {currentPage === 'LANDING' ? (
        <LandingPage 
            onStart={handleStartGame} 
            onOpenResume={() => setIsResumeOpen(true)}
        />
      ) : (
        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden relative">
            
            {/* 1. Visual Stage (Desktop: Left 65%, Mobile: Top Layer) */}
            <div className="flex-1 md:basis-[65%] lg:basis-[70%] h-full relative z-0">
                <VisualStage 
                    activeCategory={activeCategory} 
                    activeItem={activeItem}
                    onSelectCategory={handleSelectCategory}
                    onClearSelection={() => setActiveItem(null)}
                    onHome={handleHome}
                    hoveredCategory={hoveredCategory}
                />
            </div>

            {/* 2. Command Center (Desktop: Right 35%, Mobile: Slide-up Drawer/Bottom Bar) */}
            <div className={`
                fixed inset-x-0 bottom-0 z-30 
                md:relative md:inset-auto md:basis-[35%] md:lg:basis-[30%] md:h-full
                transition-transform duration-300 ease-in-out
                ${isMobileNavOpen ? 'translate-y-0 h-[70vh] max-h-[600px]' : 'translate-y-[calc(100%-60px)] h-[70vh] max-h-[600px]'}
                md:translate-y-0 md:h-auto
                bg-[#1A1A1A] border-t md:border-t-0 md:border-l border-[#333] shadow-2xl md:shadow-none
            `}>
                {/* Mobile Handle / Toggle Bar */}
                <div 
                    className="md:hidden h-[60px] flex items-center justify-between px-6 bg-[#202020] border-b border-[#333] cursor-pointer"
                    onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                >
                    <span className="font-serif text-white">Command Center</span>
                    {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
                </div>

                {/* Actual Sidebar Content */}
                <div className="h-[calc(100%-60px)] md:h-full">
                    <Sidebar 
                        activeCategory={activeCategory}
                        activeItem={activeItem}
                        onSelectCategory={handleSelectCategory}
                        onSelectItem={handleSelectItem}
                        onOpenResume={() => setIsResumeOpen(true)}
                        onHome={handleHome}
                        onHoverCategory={setHoveredCategory}
                        categories={categories}
                    />
                </div>
            </div>
        </div>
      )}

      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
      
      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal 
          onClose={() => {
            setShowOnboarding(false);
            localStorage.setItem('portfolio-onboarding-completed', 'true');
          }}
        />
      )}
    </div>
  );
};

export default App;