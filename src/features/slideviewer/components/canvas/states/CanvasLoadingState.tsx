
import React from "react";

interface CanvasLoadingStateProps {
  progress?: number;
  message?: string;
}

const CanvasLoadingState: React.FC<CanvasLoadingStateProps> = ({
  progress = 0,
  message = "読み込み中..."
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 rounded-lg">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          {progress > 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">{Math.round(progress)}%</span>
            </div>
          )}
        </div>
        <p className="text-blue-600 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

export default CanvasLoadingState;
