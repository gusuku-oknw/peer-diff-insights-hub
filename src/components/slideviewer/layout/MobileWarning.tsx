import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Tablet, ArrowLeft, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const MobileWarning: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto border-amber-200 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            画面サイズが小さすぎます
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-gray-600">
            <p className="mb-4">
              スライドビューアーは、最適な表示とレビュー体験のために
              <strong className="text-blue-600">タブレット以上の画面サイズ</strong>
              が必要です。
            </p>
          </div>

          {/* Recommended devices */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 text-sm">推奨デバイス:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <Tablet className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-800">タブレット</div>
                  <div className="text-xs text-green-600">640px以上の幅</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Monitor className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-800">デスクトップ・ノートPC</div>
                  <div className="text-xs text-blue-600">1024px以上の幅（推奨）</div>
                </div>
              </div>
            </div>
          </div>

          {/* Current screen info */}
          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="text-sm text-gray-600">
              <strong>現在の画面幅:</strong> {typeof window !== 'undefined' ? window.innerWidth : 'N/A'}px
            </div>
            <div className="text-xs text-gray-500 mt-1">
              必要な最小幅: 640px
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              画面を回転して再読み込み
            </Button>
            
            <Link to="/dashboard" className="block">
              <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                <ArrowLeft className="mr-2 h-4 w-4" />
                ダッシュボードに戻る
              </Button>
            </Link>
          </div>

          {/* Help text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              タブレットをお持ちの場合は、横向きにしてご利用ください
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileWarning;