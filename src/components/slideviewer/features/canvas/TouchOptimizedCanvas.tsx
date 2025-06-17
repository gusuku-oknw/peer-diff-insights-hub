
import React from "react";

interface TouchOptimizedCanvasProps {
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
  userType?: "student" | "enterprise";
  containerWidth?: number;
  containerHeight?: number;
}

const TouchOptimizedCanvas: React.FC<TouchOptimizedCanvasProps> = ({
  currentSlide,
  zoomLevel = 100,
  editable = false,
  userType = "enterprise",
  containerWidth = 0,
  containerHeight = 0
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow border">
        <p className="text-gray-600 text-lg mb-4">タッチ最適化キャンバス</p>
        <p className="text-sm text-gray-500">スライド {currentSlide}</p>
      </div>
    </div>
  );
};

export default TouchOptimizedCanvas;
