
import React, { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { SidePanelProps } from "@/types/slide-viewer/panel.types";
import MobileSheet from "./components/MobileSheet";
import DesktopPanel from "./components/DesktopPanel";

interface ImprovedSidePanelProps extends Omit<SidePanelProps, 'isCollapsed' | 'onToggleCollapse'> {
  userType: "student" | "enterprise";
  isHidden?: boolean;
  onToggleHide?: () => void;
  onWidthChange?: (width: number) => void;
  initialWidth?: number;
}

const ImprovedSidePanel: React.FC<ImprovedSidePanelProps> = ({
  shouldShowNotes,
  shouldShowReviewPanel,
  currentSlide,
  totalSlides,
  presenterNotes,
  isHidden = false,
  onToggleHide,
  userType,
  onWidthChange,
  initialWidth = 280,
}) => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [panelDimensions, setPanelDimensions] = useState({ width: 0, height: 0 });
  const [currentWidth, setCurrentWidth] = useState(initialWidth);
  
  // Simplified default tab logic
  const getDefaultTab = () => {
    if (shouldShowReviewPanel) return "reviews";
    return shouldShowNotes ? "notes" : "reviews";
  };
  
  const [activeTab, setActiveTab] = useState(getDefaultTab());
  const panelRef = useRef<HTMLDivElement>(null);
  
  console.log('ImprovedSidePanel render:', {
    shouldShowNotes,
    shouldShowReviewPanel,
    userType,
    currentSlide,
    activeTab,
    currentWidth
  });

  // Update width when initialWidth changes (responsive)
  useEffect(() => {
    setCurrentWidth(initialWidth);
  }, [initialWidth]);
  
  // Update tab when panel visibility changes
  useEffect(() => {
    // Only change tab if the current tab is no longer valid for the new panel state
    if (activeTab === "notes" && !shouldShowNotes && shouldShowReviewPanel) {
      console.log('ImprovedSidePanel: Switching from notes to reviews (notes panel hidden)');
      setActiveTab("reviews");
    } else if (activeTab === "reviews" && !shouldShowReviewPanel && shouldShowNotes) {
      console.log('ImprovedSidePanel: Switching from reviews to notes (review panel hidden)');
      setActiveTab("notes");
    }
  }, [shouldShowNotes, shouldShowReviewPanel]);
  
  // Track panel dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        setPanelDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateDimensions();
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setPanelDimensions({ width, height });
      }
    });
    
    if (panelRef.current) {
      resizeObserver.observe(panelRef.current);
    }

    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // Determine if we should display the panel at all
  const shouldDisplay = shouldShowNotes || shouldShowReviewPanel;
  
  if (!shouldDisplay || isHidden) {
    return null;
  }

  // Determine layout mode based on actual panel width
  const isNarrow = panelDimensions.width > 0 && panelDimensions.width < 280;
  const isVeryNarrow = panelDimensions.width > 0 && panelDimensions.width < 200;

  // Enhanced tab change handler with strict control
  const handleTabChange = (newTab: string) => {
    console.log('ImprovedSidePanel: Manual tab change requested', { from: activeTab, to: newTab });
    setActiveTab(newTab);
  };

  // Shared props for both mobile and desktop
  const sharedProps = {
    shouldShowNotes,
    shouldShowReviewPanel,
    currentSlide,
    totalSlides,
    presenterNotes,
    userType,
    panelDimensions,
    isNarrow,
    isVeryNarrow,
    activeTab,
    onTabChange: handleTabChange,
  };

  // Mobile implementation with Sheet
  if (isMobile) {
    return (
      <MobileSheet
        {...sharedProps}
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        panelRef={panelRef}
      />
    );
  }

  // Desktop implementation - now uses currentWidth instead of initialWidth
  return (
    <DesktopPanel
      {...sharedProps}
      onToggleHide={onToggleHide}
      panelRef={panelRef}
      width={currentWidth}
      ResizeHandle={null}
    />
  );
};

export default ImprovedSidePanel;
