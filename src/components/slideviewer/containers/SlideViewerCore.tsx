
import React from "react";
import { useSlideViewerLogic } from "@/hooks/slideviewer/useSlideViewerLogic";
import { useResponsiveLayout } from "@/hooks/slideviewer/useResponsiveLayout";
import MainLayout from "../layout/MainLayout";

// SlideViewer全体のロジック+レイアウト統合
const SlideViewerCore: React.FC = () => {
  const slideViewerLogic = useSlideViewerLogic();
  const responsiveLayout = useResponsiveLayout();
  return <MainLayout {...slideViewerLogic} {...responsiveLayout} />;
};

export default SlideViewerCore;
