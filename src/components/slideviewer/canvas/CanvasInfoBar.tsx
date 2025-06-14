
import React from "react";

interface CanvasInfoBarProps {
  enablePerformanceMode: boolean;
  performance: any;
  canvasConfig: any;
}

const CanvasInfoBar: React.FC<CanvasInfoBarProps> = ({
  enablePerformanceMode,
  performance,
  canvasConfig
}) => {
  return (
    <div className="flex justify-between items-center p-2 bg-gray-100 border-t border-gray-200">
      {/* Left: Performance Information */}
      <div className="flex items-center gap-4">
        {enablePerformanceMode && performance.metrics && (
          <div className="text-xs bg-black text-white px-2 py-1 rounded">
            FPS: {performance.metrics.fps} | Render: {performance.metrics.renderTime}ms
          </div>
        )}
        <div className="text-xs bg-green-600 text-white px-2 py-1 rounded">
          統合解像度: {canvasConfig.width}×{canvasConfig.height} ({canvasConfig.pixelRatio}x)
        </div>
        {canvasConfig.displayCapabilities?.is8KCapable && (
          <div className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
            8K対応
          </div>
        )}
        {canvasConfig.displayCapabilities?.is4KCapable && (
          <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
            4K対応
          </div>
        )}
      </div>

      {/* Right: Display & Resolution Information */}
      <div className="flex items-center gap-2">
        <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
          表示: {canvasConfig.displayWidth}×{canvasConfig.displayHeight}
        </div>
        {canvasConfig.displayCapabilities && (
          <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
            物理: {canvasConfig.displayCapabilities.physicalWidth}×{canvasConfig.displayCapabilities.physicalHeight}
          </div>
        )}
        {canvasConfig.pixelRatio > 2 && (
          <div className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded border">
            統合High-DPI ({canvasConfig.pixelRatio}x)
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasInfoBar;
