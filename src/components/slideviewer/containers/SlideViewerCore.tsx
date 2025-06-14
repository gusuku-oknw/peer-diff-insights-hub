
import React from "react";
import { useSlideViewerLogic } from "@/hooks/slideviewer/useSlideViewerLogic";
import { useResponsiveLayout } from "@/hooks/slideviewer/useResponsiveLayout";
import MainLayout from "../layout/MainLayout";

// SlideViewer全体のロジック+レイアウト統合
const SlideViewerCore: React.FC = () => {
  const slideViewerLogic = useSlideViewerLogic();
  const responsiveLayout = useResponsiveLayout();
  
  let finalPresentationStartTime: Date | null = null;
  const initialTimeValue = slideViewerLogic.presentationStartTime;

  // Convert initialTimeValue (which could be number, Date, or null) to Date | null
  if (typeof initialTimeValue === "number") {
    // If it's a number (timestamp), convert to Date
    finalPresentationStartTime = new Date(initialTimeValue);
  } else if (initialTimeValue instanceof Date) {
    // If it's already a Date object, use it directly.
    // This check is safe:
    // - If initialTimeValue was a number, it's caught by the first `if`.
    // - If initialTimeValue is null, `null instanceof Date` is false.
    // - If initialTimeValue is a Date object, this condition is true.
    finalPresentationStartTime = initialTimeValue;
  } else {
    // This branch catches null if initialTimeValue was (number | Date | null).
    // It also correctly sets to null for any other unexpected types.
    finalPresentationStartTime = null;
  }

  return (
    <MainLayout
      {...slideViewerLogic}
      {...responsiveLayout}
      presentationStartTime={finalPresentationStartTime} // Pass the correctly typed Date | null
    />
  );
};

export default SlideViewerCore;
