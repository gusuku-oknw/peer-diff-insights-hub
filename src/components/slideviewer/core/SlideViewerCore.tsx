
import React from "react";
import { useSlideViewerLogic } from "@/hooks/slideviewer/useSlideViewerLogic";
import { useResponsiveLayout } from "@/hooks/slideviewer/useResponsiveLayout";
import MainLayout from "./MainLayout";

// Helper to check if a value is a Date instance
function isValidDate(val: unknown): val is Date {
  return (
    typeof val === "object" &&
    val !== null &&
    Object.prototype.toString.call(val) === "[object Date]"
  );
}

/**
 * SlideViewer全体のロジック+レイアウト統合コンポーネント
 * - ビジネスロジックとレスポンシブレイアウトを統合
 * - プレゼンテーション開始時刻の型安全な処理
 */
const SlideViewerCore: React.FC = () => {
  console.log("SlideViewerCore rendering");
  
  // Always call hooks at the top level
  const slideViewerLogic = useSlideViewerLogic();
  const responsiveLayout = useResponsiveLayout();

  console.log("SlideViewerCore: hooks called successfully");

  // presentationStartTime may be number | Date | null
  const { presentationStartTime: initialTimeValue } = slideViewerLogic;

  let finalPresentationStartTime: Date | null;

  if (typeof initialTimeValue === "number") {
    finalPresentationStartTime = new Date(initialTimeValue);
  } else if (isValidDate(initialTimeValue)) {
    finalPresentationStartTime = initialTimeValue;
  } else {
    finalPresentationStartTime = null;
  }

  console.log("SlideViewerCore: about to render MainLayout");

  return (
    <MainLayout
      currentSlide={slideViewerLogic.currentSlideNumber}
      totalSlides={slideViewerLogic.slides.length}
      presenterNotes={slideViewerLogic.presenterNotes}
      userType={slideViewerLogic.userType}
      presentationStartTime={finalPresentationStartTime}
      windowDimensions={responsiveLayout.windowDimensions}
      rightPanelWidth={responsiveLayout.rightPanelWidth}
      isRightPanelOpen={responsiveLayout.isRightPanelOpen}
      contentAreaDimensions={responsiveLayout.contentAreaDimensions}
      mobile={responsiveLayout.mobile}
      tablet={responsiveLayout.tablet}
      desktop={responsiveLayout.desktop}
      isMobile={responsiveLayout.isMobile}
      isTablet={responsiveLayout.isTablet}
      isDesktop={responsiveLayout.isDesktop}
    />
  );
};

export default SlideViewerCore;
