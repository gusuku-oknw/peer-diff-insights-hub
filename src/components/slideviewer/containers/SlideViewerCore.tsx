
import React from "react";
import { useSlideViewerLogic } from "@/hooks/slideviewer/useSlideViewerLogic";
import { useResponsiveLayout } from "@/hooks/slideviewer/useResponsiveLayout";
import MainLayout from "../layout/MainLayout";

// Helper to check if a value is a Date instance
function isValidDate(val: unknown): val is Date {
  return (
    typeof val === "object" &&
    val !== null &&
    Object.prototype.toString.call(val) === "[object Date]"
  );
}

// SlideViewer全体のロジック+レイアウト統合
const SlideViewerCore: React.FC = () => {
  const slideViewerLogic = useSlideViewerLogic();
  const responsiveLayout = useResponsiveLayout();

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

  return (
    <MainLayout
      {...slideViewerLogic}
      {...responsiveLayout}
      presentationStartTime={finalPresentationStartTime}
    />
  );
};

export default SlideViewerCore;

