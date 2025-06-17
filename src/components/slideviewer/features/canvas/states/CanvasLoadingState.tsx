
import React from "react";
import { Loader2 } from "lucide-react";

interface CanvasLoadingStateProps {
  progress?: number;
  message?: string;
}

const CanvasLoadingState: React.FC<CanvasLoadingStateProps> = ({
  progress = 0,
  message = "読み込み中..."
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
        <p className="text-gray-600">{message}</p>
        {progress > 0 && (
          <div className="mt-2 w-32 bg-gray-200 rounded-full h-2 mx-auto">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasLoadingState;
