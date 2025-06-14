
import React from "react";
import { useEnhancedPanelLayout } from "@/hooks/slideviewer/useEnhancedPanelLayout";
import EnhancedPanelHeader from "./EnhancedPanelHeader";
import UnifiedTabSystem from "./UnifiedTabSystem";
import PanelContent from "./PanelContent";
import { panelTokens } from "@/design-system/tokens/panel";

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
  initialWidth = 350
}) => {
  const layout = useEnhancedPanelLayout(initialWidth);
  const [activeTab, setActiveTab] = React.useState(() => {
    if (shouldShowReviewPanel) return "dashboard";
    if (shouldShowNotes) return "notes";
    return "dashboard";
  });

  // 表示可能なタブを決定
  const availableTabs = React.useMemo(() => {
    const tabs: string[] = [];
    if (shouldShowNotes) tabs.push("notes");
    if (shouldShowReviewPanel) {
      tabs.push("dashboard", "reviews", "checklist", "suggestions");
    }
    return tabs;
  }, [shouldShowNotes, shouldShowReviewPanel]);

  // パネルが非表示または表示するタブがない場合は何も表示しない
  if (isHidden || availableTabs.length === 0) return null;

  const showTabSystem = availableTabs.length > 1;
  const showProgress = activeTab === "dashboard" || activeTab === "checklist";

  return (
    <div 
      className="h-full bg-white border-l border-gray-200 flex flex-col transition-all duration-300 ease-in-out shadow-lg overflow-hidden"
      style={{ 
        width: `${layout.panelWidth}px`,
        borderLeftColor: panelTokens.colors.border.light,
        backgroundColor: panelTokens.colors.background.primary
      }}
    >
      {/* ヘッダー */}
      <EnhancedPanelHeader
        activeTab={activeTab}
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        userType={userType}
        sizeClass={layout.sizeClass}
        completionPercentage={75}
        onClose={onToggleHide}
        showProgress={showProgress}
      />

      {/* タブシステム（複数タブがある場合のみ） */}
      {showTabSystem && (
        <div className={`flex-shrink-0 ${
          layout.sizeClass === 'xs' ? 'px-2 py-2' : 'px-4 py-3'
        } bg-white/80 border-b border-gray-100`}>
          <UnifiedTabSystem
            activeTab={activeTab}
            onTabChange={setActiveTab}
            availableTabs={availableTabs}
            sizeClass={layout.sizeClass}
            className="w-full"
          />
        </div>
      )}

      {/* コンテンツエリア */}
      <div className="flex-1 min-h-0 overflow-hidden bg-white">
        <PanelContent
          shouldShowNotes={shouldShowNotes}
          shouldShowReviewPanel={shouldShowReviewPanel}
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          presenterNotes={presenterNotes}
          userType={userType}
          panelWidth={layout.panelWidth}
          isNarrow={layout.isNarrow}
          isVeryNarrow={layout.isVeryNarrow}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export default SidePanel;
