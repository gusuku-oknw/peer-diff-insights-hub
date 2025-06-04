
import React from "react";
import { Tabs } from "@/components/ui/tabs";
import PanelHeader from "./PanelHeader";
import PanelContent from "./PanelContent";

interface TabsContainerProps {
  shouldShowNotes: boolean;
  shouldShowReviewPanel: boolean;
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
  userType: "student" | "enterprise";
  panelDimensions: { width: number; height: number };
  isNarrow: boolean;
  isVeryNarrow: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMobile: boolean;
  onToggleHide?: () => void;
  onSheetClose?: () => void;
}

const TabsContainer: React.FC<TabsContainerProps> = ({
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
  onTabChange,
  isMobile,
  onToggleHide,
  onSheetClose,
}) => {
  return (
    <div className="h-full flex flex-col relative z-10">
      {shouldShowNotes && shouldShowReviewPanel && (
        <Tabs value={activeTab} onValueChange={onTabChange} className="h-full flex flex-col">
          <PanelHeader
            shouldShowNotes={shouldShowNotes}
            shouldShowReviewPanel={shouldShowReviewPanel}
            isVeryNarrow={isVeryNarrow}
            isMobile={isMobile}
            onToggleHide={onToggleHide}
            onSheetClose={onSheetClose}
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
            onTabChange={onTabChange}
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
          onTabChange={onTabChange}
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
          onTabChange={onTabChange}
        />
      )}
    </div>
  );
};

export default TabsContainer;
