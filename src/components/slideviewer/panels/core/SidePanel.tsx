
import React, { useState, useRef, useCallback } from 'react';
import TabsContainer from '../components/TabsContainer';
import { useResponsiveLayout } from '@/hooks/slideviewer/useResponsiveLayout';

interface SidePanelProps {
  shouldShowNotes: boolean;
  shouldShowReviewPanel: boolean;
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
  userType: "student" | "enterprise";
  isHidden?: boolean;
  onToggleHide?: () => void;
  initialWidth?: number;
  onWidthChange?: (width: number) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  shouldShowNotes,
  shouldShowReviewPanel,
  currentSlide,
  totalSlides,
  presenterNotes,
  userType,
  isHidden = false,
  onToggleHide,
  initialWidth = 320,
  onWidthChange
}) => {
  const [activeTab, setActiveTab] = useState<string>("notes");
  const { mobile, tablet } = useResponsiveLayout();
  
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelDimensions, setPanelDimensions] = useState({ 
    width: initialWidth, 
    height: 600 
  });

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  if (isHidden) {
    return null;
  }

  const isNarrow = panelDimensions.width < 300;
  const isVeryNarrow = panelDimensions.width < 250;

  return (
    <div 
      ref={panelRef}
      className="h-full bg-white border-l border-gray-200 flex flex-col"
      style={{ width: `${panelDimensions.width}px` }}
    >
      <TabsContainer
        shouldShowNotes={shouldShowNotes}
        shouldShowReviewPanel={shouldShowReviewPanel}
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        presenterNotes={presenterNotes}
        userType={userType}
        panelDimensions={panelDimensions}
        isNarrow={isNarrow}
        isVeryNarrow={isVeryNarrow}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isMobile={mobile}
        onToggleHide={onToggleHide}
      />
    </div>
  );
};

export default SidePanel;
