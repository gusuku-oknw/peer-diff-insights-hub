
import React from "react";
import NotesPanel from "../NotesPanel";
import ReviewPanel from "../review/ReviewPanel";

interface PanelContentProps {
  shouldShowNotes: boolean;
  shouldShowReviewPanel: boolean;
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
  userType: "student" | "enterprise";
  panelWidth: number;
  isNarrow: boolean;
  isVeryNarrow: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const PanelContent: React.FC<PanelContentProps> = ({
  shouldShowNotes,
  shouldShowReviewPanel,
  currentSlide,
  totalSlides,
  presenterNotes,
  userType,
  panelWidth,
  isNarrow,
  isVeryNarrow,
  activeTab,
  onTabChange,
}) => {
  if (shouldShowNotes && shouldShowReviewPanel) {
    return (
      <div className="flex-grow flex flex-col">
        {activeTab === "notes" && (
          <NotesPanel 
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            presenterNotes={presenterNotes}
            panelWidth={panelWidth}
            panelHeight={600}
            isNarrow={isNarrow}
            isVeryNarrow={isVeryNarrow}
          />
        )}
        {activeTab === "reviews" && (
          <ReviewPanel
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            userType={userType}
            panelWidth={panelWidth}
            panelHeight={600}
            isNarrow={isNarrow}
            isVeryNarrow={isVeryNarrow}
          />
        )}
      </div>
    );
  }
  if (shouldShowReviewPanel) {
    return (
      <ReviewPanel
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        userType={userType}
        panelWidth={panelWidth}
        panelHeight={600}
        isNarrow={isNarrow}
        isVeryNarrow={isVeryNarrow}
      />
    );
  }
  if (shouldShowNotes) {
    return (
      <NotesPanel 
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        presenterNotes={presenterNotes}
        panelWidth={panelWidth}
        panelHeight={600}
        isNarrow={isNarrow}
        isVeryNarrow={isVeryNarrow}
      />
    );
  }
  return null;
};

export default PanelContent;
