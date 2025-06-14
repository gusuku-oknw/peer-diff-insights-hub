
import React, { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import PanelHeader from "./components/panel-header";
import PanelContent from "./components/panel-content";

interface ImprovedSidePanelProps {
  shouldShowNotes: boolean;
  shouldShowReviewPanel: boolean;
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
  isHidden: boolean;
  onToggleHide?: () => void;
  userType: "student" | "enterprise";
  onWidthChange?: (width: number) => void;
  initialWidth?: number;
}

const ImprovedSidePanel: React.FC<ImprovedSidePanelProps> = ({
  shouldShowNotes,
  shouldShowReviewPanel,
  currentSlide,
  totalSlides,
  presenterNotes,
  isHidden,
  onToggleHide,
  userType,
  onWidthChange,
  initialWidth = 400,
}) => {
  const [activeTab, setActiveTab] = useState("review");
  const [panelDimensions, setPanelDimensions] = useState({ width: initialWidth, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      const height = window.innerHeight - 100;
      setPanelDimensions({ width: initialWidth, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [initialWidth]);

  const isNarrow = panelDimensions.width < 350;
  const isVeryNarrow = panelDimensions.width < 280;

  return (
    <div className="h-full flex flex-col relative z-10">
      {shouldShowNotes && shouldShowReviewPanel && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <PanelHeader
            shouldShowNotes={shouldShowNotes}
            shouldShowReviewPanel={shouldShowReviewPanel}
            isVeryNarrow={isVeryNarrow}
            isMobile={false}
            onToggleHide={onToggleHide}
            onSheetClose={() => {}}
          />
          
          <PanelContent
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
            onTabChange={setActiveTab}
          />
        </Tabs>
      )}
      
      {!shouldShowNotes && shouldShowReviewPanel && (
        <PanelContent
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
          onTabChange={setActiveTab}
        />
      )}
      
      {shouldShowNotes && !shouldShowReviewPanel && (
        <PanelContent
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
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
};

export default ImprovedSidePanel;
