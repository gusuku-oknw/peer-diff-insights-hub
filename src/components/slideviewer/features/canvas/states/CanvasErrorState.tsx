
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, RotateCcw } from "lucide-react";

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
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
      <div className="text-center p-6">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          エラーが発生しました
        </h3>
        <p className="text-sm text-gray-600 mb-6 max-w-md">
          {error}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            再試行
          </Button>
          <Button onClick={onReset} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            リセット
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CanvasErrorState;
