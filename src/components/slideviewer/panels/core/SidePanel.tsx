import React, { useState } from "react";
import TabsContainer from "../components/TabsContainer";
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

  if (shouldShowNotes && shouldShowReviewPanel) {
    // Use TabsContainer to render proper Tabs context and triggers
    return (
      <TabsContainer
        shouldShowNotes={shouldShowNotes}
        shouldShowReviewPanel={shouldShowReviewPanel}
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        presenterNotes={presenterNotes}
        userType={userType}
        panelDimensions={{ width: panelWidth, height: 600 }}
        isNarrow={isNarrow}
        isVeryNarrow={isVeryNarrow}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobile={false}
        onToggleHide={onToggleHide}
      />
    );
  }

  // If only one panel is showing render just PanelContent (no header/triggers needed)
  return (
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
  );
};

export default SidePanel;
