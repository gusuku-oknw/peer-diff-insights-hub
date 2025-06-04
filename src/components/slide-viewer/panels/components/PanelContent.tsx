
import React from "react";
import NotesPanel from "../../../slide-viewer/panels/NotesPanel";
import SimplifiedReviewPanel from "../SimplifiedReviewPanel";
import { Tabs, TabsContent } from "@/components/ui/tabs";

interface PanelContentProps {
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
}

const PanelContent: React.FC<PanelContentProps> = ({
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
}) => {
  if (shouldShowNotes && shouldShowReviewPanel) {
    return (
      <Tabs value={activeTab} onValueChange={onTabChange} className="h-full flex flex-col">
        <TabsContent value="notes" className="flex-grow overflow-hidden m-0 p-0 min-h-0">
          <NotesPanel 
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            presenterNotes={presenterNotes}
            panelWidth={panelDimensions.width}
            panelHeight={panelDimensions.height}
            isNarrow={isNarrow}
            isVeryNarrow={isVeryNarrow}
          />
        </TabsContent>
        
        <TabsContent value="reviews" className="flex-grow overflow-hidden m-0 p-0 min-h-0">
          <SimplifiedReviewPanel
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            userType={userType}
            panelWidth={panelDimensions.width}
            panelHeight={panelDimensions.height}
            isNarrow={isNarrow}
            isVeryNarrow={isVeryNarrow}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        </TabsContent>
      </Tabs>
    );
  }

  if (shouldShowReviewPanel) {
    return (
      <SimplifiedReviewPanel
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        userType={userType}
        panelWidth={panelDimensions.width}
        panelHeight={panelDimensions.height}
        isNarrow={isNarrow}
        isVeryNarrow={isVeryNarrow}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    );
  }

  if (shouldShowNotes) {
    return (
      <NotesPanel 
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        presenterNotes={presenterNotes}
        panelWidth={panelDimensions.width}
        panelHeight={panelDimensions.height}
        isNarrow={isNarrow}
        isVeryNarrow={isVeryNarrow}
      />
    );
  }

  return null;
};

export default PanelContent;
