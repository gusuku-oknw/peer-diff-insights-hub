// ScriptTab.tsx
import React from "react";
import { BookOpen, FileText } from "lucide-react";

interface ScriptTabProps {
    presenterNotes: Record<number, string>;
}

const ScriptTab: React.FC<ScriptTabProps> = ({ presenterNotes }) => {
    const getAllScript = () => {
        const slideNumbers = Object.keys(presenterNotes).map(Number).sort((a, b) => a - b);
        return slideNumbers
            .map((slideNum) => ({
                slideNumber: slideNum,
                script: presenterNotes[slideNum] || ""
            }))
            .filter((slide) => slide.script.trim());
    };

    const allScripts = getAllScript();

    return (
        <div className="p-4 space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-600" />
                    プレゼンテーション台本（全体）
                </h3>
                <p className="text-sm text-gray-600">
                    全スライドの台本を通して確認できます。レビュー時の参考資料としてご活用ください。
                </p>
            </div>

            {allScripts.length > 0 ? (
                allScripts.map((slide) => (
                    <div key={slide.slideNumber} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-bold text-blue-600">{slide.slideNumber}</span>
                            </div>
                            <h4 className="font-medium text-gray-900">スライド {slide.slideNumber} の台本</h4>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{slide.script}</p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">台本が設定されていません</p>
                    <p className="text-sm text-gray-400">各スライドのメモ欄に台本を記入してください</p>
                </div>
            )}
        </div>
    );
};

export default ScriptTab;
