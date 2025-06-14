
import React from "react";
import { Progress } from "@/components/ui/progress";

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
      <div className="flex flex-col items-center max-w-sm w-full px-6">
        <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <h3 className="text-blue-600 text-lg font-medium mb-2">{message}</h3>
        {progress > 0 && (
          <div className="w-full">
            <Progress value={progress} className="mb-2" />
            <p className="text-xs text-gray-500 text-center">{progress}% 完了</p>
          </div>
        )}
        <p className="text-xs text-gray-400 text-center mt-2">
          高品質な表示のために最適化しています
        </p>
      </div>
    </div>
  );
};

export default CanvasLoadingState;
