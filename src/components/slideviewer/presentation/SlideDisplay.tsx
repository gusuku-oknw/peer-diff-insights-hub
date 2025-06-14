
import React, { useRef, useEffect, useState } from "react";
import OptimizedSlideCanvas from "@/features/slideviewer/components/canvas/OptimizedSlideCanvas";

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
      <OptimizedSlideCanvas
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
