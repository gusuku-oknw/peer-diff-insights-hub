
import React, { useState } from "react";
import PanelHeader from "./PanelHeader";
import PanelContent from "./PanelContent";

interface SidePanelProps {
  shouldShowNotes: boolean;
  shouldShowReviewPanel: boolean;
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
  isHidden?: boolean;
  onToggleHide?: () => void;
  userType: "student" | "enterprise";
  onWidthChange?: (width: number) => void;
  initialWidth?: number;
}

const SidePanel: React.FC<SidePanelProps> = ({
  shouldShowNotes,
  shouldShowReviewPanel,
  currentSlide,
  totalSlides,
  presenterNotes,
  isHidden = false,
  onToggleHide,
  userType,
  onWidthChange,
  initialWidth = 350
}) => {
  const [activeTab, setActiveTab] = useState(
    shouldShowReviewPanel ? "reviews" : shouldShowNotes ? "notes" : "reviews"
  );
  const [panelWidth] = useState(initialWidth);

  if (isHidden || !(shouldShowNotes || shouldShowReviewPanel)) return null;
  const isNarrow = panelWidth < 350;
  const isVeryNarrow = panelWidth < 280;

  return (
    <div className="h-full flex flex-col relative z-10 bg-white">
      <PanelHeader
        shouldShowNotes={shouldShowNotes}
        shouldShowReviewPanel={shouldShowReviewPanel}
        isVeryNarrow={isVeryNarrow}
        isMobile={false}
        onToggleHide={onToggleHide}
      />
      <PanelContent
        shouldShowNotes={shouldShowNotes}
        shouldShowReviewPanel={shouldShowReviewPanel}
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        presenterNotes={presenterNotes}
        userType={userType}
        panelWidth={panelWidth}
        isNarrow={isNarrow}
        isVeryNarrow={isVeryNarrow}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default SidePanel;
