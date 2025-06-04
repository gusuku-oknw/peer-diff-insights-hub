
import React from "react";
import { useSlideViewerLogic } from "@/hooks/slide-viewer/useSlideViewerLogic";
import { useResponsiveLayout } from "@/hooks/slide-viewer/useResponsiveLayout";
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
