import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PanelHeader from "../core/PanelHeader";
import PanelContent from "../core/PanelContent";

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
}) => {
  return (
    <div className="h-full flex flex-col relative z-10">
      {shouldShowNotes && shouldShowReviewPanel && (
        <Tabs value={activeTab} onValueChange={onTabChange} className="h-full flex flex-col">
          {/* Tab Triggers inside the Tabs context */}
          <TabsList className="grid grid-cols-2 flex-1 min-w-0 bg-white shadow-sm">
            <TabsTrigger 
              value="notes" 
              className="flex items-center gap-1 min-w-0 transition-all hover:bg-blue-50 data-[state=active]:bg-blue-100"
            >
              <span className="truncate font-medium">メモ</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="flex items-center gap-1 min-w-0 transition-all hover:bg-purple-50 data-[state=active]:bg-purple-100"
            >
              <span className="truncate font-medium">レビュー</span>
            </TabsTrigger>
          </TabsList>
          
          {/* The header is just close button etc */}
          <PanelHeader
            isVeryNarrow={isVeryNarrow}
            isMobile={isMobile}
            onToggleHide={onToggleHide}
          />
          <PanelContent
            shouldShowNotes={shouldShowNotes}
            shouldShowReviewPanel={shouldShowReviewPanel}
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            presenterNotes={presenterNotes}
            userType={userType}
            panelWidth={panelDimensions.width}
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
          panelWidth={panelDimensions.width}
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
          panelWidth={panelDimensions.width}
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
