import React, { useState, useEffect, useRef } from 'react';
import { Page, CategoryType, PortfolioItem } from './types';
import LandingPage from './components/LandingPage';
import VisualStage from './components/VisualStage';
import Sidebar from './components/Sidebar';
import ResumeModal from './components/ResumeModal';
import ReviewAvatar from './components/ReviewAvatar';
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
    // If tapping the same category, toggle it off
    if (activeCategory === cat) {
      setActiveCategory(null);
      setActiveItem(null);
      return;
    }

    // If switching categories, reset to starting position first
    if (activeCategory) {
      setActiveItem(null);
      setActiveCategory(null);

      // Wait for animation, then select new category
      setTimeout(() => {
        setActiveCategory(cat);
        setActiveItem(null);
        setIsMobileNavOpen(true);
      }, 400);
    } else {
      // First selection
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
      }, 500); // Reduced from 700ms to 400ms for snappier feedback
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

          {/* Mobile-only: Avatar + speech bubble above the board (chess.com style) */}
          <div className="md:hidden shrink-0 bg-[#1A1A1A] border-b border-[#333] px-3 py-2 z-10 max-h-[30vh] overflow-y-auto">
            <ReviewAvatar
              activeItem={activeItem}
              activeCategoryCommentary={activeCategory ? categories[activeCategory]?.commentary : undefined}
              activeCategoryMoveGrade={activeCategory ? categories[activeCategory]?.moveGrade : undefined}
              isSidebar={true}
            />
          </div>

          {/* 1. Visual Stage (Desktop: Left side, Mobile: Full layer) */}
          <div className={`flex-1 h-full relative min-h-0 ${activeItem ? 'z-[60]' : 'z-0'}`}>
            <VisualStage
              activeCategory={activeCategory}
              activeItem={activeItem}
              onSelectCategory={handleSelectCategory}
              onClearSelection={() => setActiveItem(null)}
              onHome={handleHome}
              hoveredCategory={hoveredCategory}
              onBoardTap={() => setIsMobileNavOpen(true)}
              onSelectItem={handleSelectItem}
              categories={categories}
            />
          </div>

          {/* 2. Command Center (Desktop: Right panel, Tablet: Narrower panel, Mobile: Slide-up Drawer) */}
          <div className={`
                fixed inset-x-0 bottom-0 z-30 h-[65vh]
                md:relative md:inset-auto md:z-auto md:h-full
                md:w-[33%] lg:w-[30%] xl:w-[28%]
                md:min-w-[280px] md:max-w-[440px]
                md:flex-shrink-0
                transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
                ${isMobileNavOpen ? 'translate-y-0' : 'translate-y-[calc(100%-56px)]'}
                md:translate-y-0
                bg-[#1A1A1A] border-t md:border-t-0 md:border-l border-[#333]
                shadow-[0_-8px_30px_rgba(0,0,0,0.4)] md:shadow-none
                rounded-t-2xl md:rounded-none
            `}
          >
            {/* Mobile Handle / Toggle Bar */}
            <div
              className="md:hidden flex flex-col items-center cursor-pointer select-none"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            >
              {/* Swipe Indicator */}
              <div className="w-10 h-1 bg-[#555] rounded-full mt-2 mb-1"></div>
              <div className="h-[44px] w-full flex items-center justify-between px-5">
                <span className="font-serif text-sm text-white">Command Center</span>
                <div className="flex items-center gap-2">
                  {activeCategory && !isMobileNavOpen && (
                    <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider">Tap to expand</span>
                  )}
                  {isMobileNavOpen ? <X size={18} className="text-[#999]" /> : <Menu size={18} className="text-[#999]" />}
                </div>
              </div>
            </div>

            {/* Actual Sidebar Content */}
            <div className="h-[calc(100%-56px)] md:h-full overflow-hidden">
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