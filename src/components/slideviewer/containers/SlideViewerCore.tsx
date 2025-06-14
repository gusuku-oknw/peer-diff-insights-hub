
import React from "react";
import { useSlideViewerLogic } from "@/hooks/slideviewer/useSlideViewerLogic";
import { useResponsiveLayout } from "@/hooks/slideviewer/useResponsiveLayout";
import MainLayout from "../layout/MainLayout";

// SlideViewer全体のロジック+レイアウト統合
const SlideViewerCore: React.FC = () => {
  const slideViewerLogic = useSlideViewerLogic();
  const responsiveLayout = useResponsiveLayout();
  
  // 型変換: number | null → Date | null
  let presentationStartTime: Date | null = null;
  if (
    typeof slideViewerLogic.presentationStartTime === "number" &&
    slideViewerLogic.presentationStartTime !== null
  ) {
    presentationStartTime = new Date(slideViewerLogic.presentationStartTime);
  } else if (slideViewerLogic.presentationStartTime instanceof Date) {
    presentationStartTime = slideViewerLogic.presentationStartTime;
  } else {
    presentationStartTime = null;
  }

  return (
    <MainLayout
      {...slideViewerLogic}
      {...responsiveLayout}
      presentationStartTime={presentationStartTime}
    />
  );
};

export default SlideViewerCore;
