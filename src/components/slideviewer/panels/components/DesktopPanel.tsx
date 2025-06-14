
import React from "react";
import PanelContent from "./PanelContent";

interface DesktopPanelProps {
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
  onToggleHide?: () => void;
  panelRef: React.RefObject<HTMLDivElement>;
  width: number;
  ResizeHandle: React.ComponentType<any> | null;
}

const DesktopPanel: React.FC<DesktopPanelProps> = ({
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
  onToggleHide,
  panelRef,
  width,
  ResizeHandle,
}) => {
  return (
    <div
      ref={panelRef}
      className="h-full bg-white border-l border-gray-200 flex flex-col transition-all duration-300 ease-in-out"
      style={{ width: `${width}px` }}
    >
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
        onClose={onToggleHide}
        isMobile={false}
      />
      
      {ResizeHandle && <ResizeHandle />}
    </div>
  );
};

export default DesktopPanel;
