
import React, { useRef, useEffect, useState } from "react";
import UnifiedSlideCanvas from "@/components/slideviewer/canvas/UnifiedSlideCanvas";

interface SlideDisplayProps {
  currentSlide: number;
  zoomLevel: number;
  editable: boolean;
  userType: "student" | "enterprise";
  containerWidth: number;
  containerHeight: number;
}

const SlideDisplay: React.FC<SlideDisplayProps> = ({
  currentSlide,
  zoomLevel,
  editable,
  userType,
  containerWidth,
  containerHeight
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <UnifiedSlideCanvas
        currentSlide={currentSlide}
        zoomLevel={zoomLevel}
        editable={editable}
        userType={userType}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
        enablePerformanceMode={true}
      />
    </div>
  );
};

export default SlideDisplay;
