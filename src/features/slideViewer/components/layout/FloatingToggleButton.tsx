
import React from "react";
import { Button } from "@/components/ui/button";
import { PanelRightOpen } from "lucide-react";
import { useSlideStore } from "@/stores/slide-store";
import type { ViewerMode } from "@/types/slide.types";

interface FloatingToggleButtonProps {
  viewerMode: ViewerMode;
  showPresenterNotes: boolean;
  isFullScreen: boolean;
}

export const FloatingToggleButton: React.FC<FloatingToggleButtonProps> = ({
  viewerMode,
  showPresenterNotes,
  isFullScreen,
}) => {
  const { rightPanelHidden, setRightPanelHidden } = useSlideStore();

  // 右パネル表示ロジック
  const shouldShowNotes = (viewerMode === "presentation" && showPresenterNotes) || 
                         (viewerMode === "review" && showPresenterNotes);
  const shouldShowReviewPanel = viewerMode === "review";
  const shouldDisplayRightPanel = shouldShowNotes || shouldShowReviewPanel;
  
  const hideRightPanelCompletely = (viewerMode === "presentation" && isFullScreen) || 
                                  !shouldDisplayRightPanel;

  if (hideRightPanelCompletely || !shouldDisplayRightPanel || !rightPanelHidden) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setRightPanelHidden(false)}
      className="fixed top-1/2 right-4 z-50 shadow-lg bg-white hover:bg-gray-50 border-2 transition-all duration-200 hover:scale-105 h-10 w-10 p-0"
      title="右パネルを表示"
    >
      <PanelRightOpen className="h-4 w-4 text-gray-600" />
    </Button>
  );
};
