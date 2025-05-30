
import React from "react";
import TabsContainer from "./TabsContainer";

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
  ResizeHandle: ({ className, position }: { className?: string; position?: 'left' | 'right' | 'top' | 'bottom' }) => JSX.Element;
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
      className="h-full bg-gradient-to-b from-gray-50 to-white border-l border-gray-200 overflow-hidden flex flex-col transition-all duration-300 ease-in-out shadow-sm relative z-10" 
      ref={panelRef}
      style={{ width }}
    >
      {/* Resize handle on the left side */}
      <ResizeHandle position="left" className="z-30" />
      
      <TabsContainer
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
        isMobile={false}
        onToggleHide={onToggleHide}
      />
    </div>
  );
};

export default DesktopPanel;
