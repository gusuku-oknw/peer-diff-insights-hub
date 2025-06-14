
import React from "react";
import SlideContent from "./SlideContent";
import type { ViewerMode } from "@/types/slide.types";

interface PresentationContentProps {
  viewerMode: ViewerMode;
  userType: "student" | "enterprise";
  currentSlide: number;
  totalSlides: number;
  zoom: number;
  showPresenterNotes: boolean;
  isFullScreen: boolean;
  presentationStartTime: Date | null;
  presenterNotes: Record<number, string>;
  elapsedTime: number;
  displayCount: number;
  commentedSlides: number[];
  mockComments: any[];
  onSlideChange: (slide: number) => void;
  rightPanelVisible: boolean;
  hideRightPanelCompletely: boolean;
  leftSidebarOpen: boolean;
  onOpenOverallReview: () => void;
}

const PresentationContent: React.FC<PresentationContentProps> = (props) => {
  return (
    <div className="flex-1 flex overflow-hidden min-w-0 h-full">
      <SlideContent {...props} />
    </div>
  );
};
export default PresentationContent;
