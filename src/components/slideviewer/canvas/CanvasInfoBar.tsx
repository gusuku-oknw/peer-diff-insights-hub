
import React from "react";

interface CanvasInfoBarProps {
  enablePerformanceMode: boolean;
  performance: any;
  canvasConfig: any;
  zoomLevel: number;
}

const CanvasInfoBar: React.FC<CanvasInfoBarProps> = ({
  enablePerformanceMode,
  performance,
  canvasConfig,
  zoomLevel
}) => {
  return (
    <div className="flex justify-between items-center p-2 bg-gray-50 border-t border-gray-200 text-xs">
      {/* Left: Performance and Canvas Information */}
      <div className="flex items-center gap-3">
        {enablePerformanceMode && performance.metrics && (
          <div className="bg-gray-800 text-white px-2 py-1 rounded">
            FPS: {performance.metrics.fps} | 描画: {performance.metrics.renderTime}ms
          </div>
        )}
        <div className="bg-blue-600 text-white px-2 py-1 rounded">
          解像度: {canvasConfig.width}×{canvasConfig.height}
        </div>
        <div className="bg-green-600 text-white px-2 py-1 rounded">
          ズーム: {zoomLevel}%
        </div>
        {canvasConfig.pixelRatio > 1 && (
          <div className="bg-purple-600 text-white px-2 py-1 rounded">
            DPI: {canvasConfig.pixelRatio}x
          </div>
        )}
      </div>

      {/* Right: Display Information */}
      <div className="flex items-center gap-2">
        <div className="bg-gray-600 text-white px-2 py-1 rounded">
          表示: {canvasConfig.displayWidth}×{canvasConfig.displayHeight}
        </div>
        {canvasConfig.displayCapabilities && (
          <div className="text-gray-600 bg-white px-2 py-1 rounded border">
            物理: {canvasConfig.displayCapabilities.physicalWidth}×{canvasConfig.displayCapabilities.physicalHeight}
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasInfoBar;
