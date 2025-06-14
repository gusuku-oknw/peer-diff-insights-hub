
import React from "react";
import { AlertTriangle, RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CanvasErrorStateProps {
  error: string;
  onRetry: () => void;
  onReset: () => void;
}

const CanvasErrorState: React.FC<CanvasErrorStateProps> = ({
  error,
  onRetry,
  onReset
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-95 rounded-lg">
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow border-red-200 max-w-md">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">エラーが発生しました</h3>
        <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        
        <div className="flex gap-3">
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-blue-50"
          >
            <RefreshCw className="h-4 w-4" />
            再試行
          </Button>
          
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4" />
            リセット
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CanvasErrorState;
