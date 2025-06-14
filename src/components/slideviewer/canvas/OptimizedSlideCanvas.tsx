
import React from "react";

interface OptimizedSlideCanvasProps {
  currentSlide: number;
  zoomLevel: number;
  editable: boolean;
  userType: "student" | "enterprise";
  containerWidth: number;
  containerHeight: number;
  enablePerformanceMode: boolean;
}

const OptimizedSlideCanvas: React.FC<OptimizedSlideCanvasProps> = ({
  currentSlide,
  zoomLevel,
  editable,
  userType,
  containerWidth,
  containerHeight,
  enablePerformanceMode
}) => {
  return (
    <div 
      className="bg-white border border-gray-200 shadow-lg rounded-lg flex items-center justify-center"
      style={{
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        transform: `scale(${zoomLevel / 100})`
      }}
    >
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          スライド {currentSlide}
        </h2>
        <p className="text-gray-500">
          {editable ? "編集モード" : "閲覧モード"}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          ズーム: {zoomLevel}%
        </p>
      </div>
    </div>
  );
};

export default OptimizedSlideCanvas;
