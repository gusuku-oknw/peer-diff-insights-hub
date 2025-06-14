
import React from "react";
import { useSlideViewerLogic } from "@/hooks/slideviewer/useSlideViewerLogic";
import { useResponsiveLayout } from "@/hooks/slideviewer/useResponsiveLayout";
import MainLayout from "../layout/MainLayout";

// SlideViewer全体のロジック+レイアウト統合
const SlideViewerCore: React.FC = () => {
  const slideViewerLogic = useSlideViewerLogic();
  const responsiveLayout = useResponsiveLayout();

  // presentationStartTime may be number | Date | null
  const { presentationStartTime: initialTimeValue } = slideViewerLogic;

  let finalPresentationStartTime: Date | null;

  if (typeof initialTimeValue === "number") {
    finalPresentationStartTime = new Date(initialTimeValue);
  } else if (
    typeof initialTimeValue === "object" &&
    initialTimeValue !== null &&
    initialTimeValue instanceof Date
  ) {
    finalPresentationStartTime = initialTimeValue;
  } else {
    finalPresentationStartTime = null;
  }

  return (
    <MainLayout
      {...slideViewerLogic}
      {...responsiveLayout}
      presentationStartTime={finalPresentationStartTime}
    />
  );
};

export default SlideViewerCore;
