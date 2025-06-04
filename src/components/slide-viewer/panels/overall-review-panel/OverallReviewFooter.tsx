// OverallReviewFooter.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const OverallReviewFooter: React.FC = () => {
    return (
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0 h-15">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MessageSquare className="h-4 w-4" />
                <span>最終更新: 5分前</span>
            </div>
            <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                    レポート出力
                </Button>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                    改善を適用
                </Button>
            </div>
        </div>
    );
};

export default OverallReviewFooter;
