
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Settings } from "lucide-react";

interface CanvasErrorStateProps {
  error: string;
  onRetry: () => void;
  onReset?: () => void;
}

const CanvasErrorState: React.FC<CanvasErrorStateProps> = ({
  error,
  onRetry,
  onReset
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-95 rounded-lg">
      <Card className="p-6 max-w-md border-red-200 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            キャンバスエラー
          </h3>
          <p className="text-sm text-red-600 mb-4 leading-relaxed">
            {error}
          </p>
          <div className="flex space-x-3">
            <Button 
              onClick={onRetry}
              size="sm"
              className="bg-red-500 hover:bg-red-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              再試行
            </Button>
            {onReset && (
              <Button 
                onClick={onReset}
                variant="outline"
                size="sm"
                className="border-red-300"
              >
                <Settings className="w-4 h-4 mr-2" />
                リセット
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            問題が続く場合はブラウザをリフレッシュしてください
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CanvasErrorState;
