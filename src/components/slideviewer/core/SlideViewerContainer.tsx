
import React from "react";
import { useSlideViewerLogic } from "@/hooks/slideviewer/useSlideViewerLogic";
import { useResponsiveLayout } from "@/hooks/slideviewer/useResponsiveLayout";
import SlideViewerLayout from "./SlideViewerLayout";

const SlideViewerContainer: React.FC = () => {
  const slideViewerLogic = useSlideViewerLogic();
  const responsiveLayout = useResponsiveLayout();

  return (
    <SlideViewerLayout
      {...slideViewerLogic}
      {...responsiveLayout}
    />
  );
};

export default SlideViewerContainer;
