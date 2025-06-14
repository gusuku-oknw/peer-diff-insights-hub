
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
  const val = slideViewerLogic.presentationStartTime;
  if (typeof val === "number" && val !== null) {
    presentationStartTime = new Date(val);
  } else if (
    typeof val === "object" &&
    val !== null &&
    "getTime" in val &&
    typeof (val as Date).getTime === "function"
  ) {
    presentationStartTime = val as Date;
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

