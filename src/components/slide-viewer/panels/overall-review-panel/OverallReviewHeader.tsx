// OverallReviewHeader.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, X } from "lucide-react";

interface OverallReviewHeaderProps {
    totalSlides: number;
    onClose: () => void;
}

const OverallReviewHeader: React.FC<OverallReviewHeaderProps> = ({
                                                                     totalSlides,
                                                                     onClose
                                                                 }) => {
    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50 flex-shrink-0 h-20">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">プレゼンテーション全体評価</h2>
                    <p className="text-sm text-gray-600">全{totalSlides}スライドの総合レビュー結果</p>
                </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default OverallReviewHeader;
