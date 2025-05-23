
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface AIReviewSummaryProps {
  slideId: number;
}

const AIReviewSummary = ({ slideId }: AIReviewSummaryProps) => {
  return (
    <>
      <SheetHeader>
        <SheetTitle>AI要約</SheetTitle>
        <SheetDescription>
          すべてのコメントの要約と傾向分析
        </SheetDescription>
      </SheetHeader>
      <div className="py-4">
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
          <h4 className="font-medium text-purple-900 mb-2">要点まとめ</h4>
          <p className="text-sm text-purple-800">
            このスライドに対する主なフィードバックはタイトルの表現と図表のわかりやすさについてです。特に、タイトルをより具体的にすること、図表の数値表現の改善が提案されています。
          </p>
        </div>
        
        <h4 className="font-medium text-gray-900 mb-2">カテゴリ分布</h4>
        <div className="flex mb-6">
          <div className="flex-1 text-center p-2">
            <div className="inline-block w-3 h-3 rounded-full bg-blue-500 mb-1"></div>
            <p className="text-xs">内容</p>
            <p className="font-bold">50%</p>
          </div>
          <div className="flex-1 text-center p-2">
            <div className="inline-block w-3 h-3 rounded-full bg-purple-500 mb-1"></div>
            <p className="text-xs">デザイン</p>
            <p className="font-bold">50%</p>
          </div>
          <div className="flex-1 text-center p-2">
            <div className="inline-block w-3 h-3 rounded-full bg-green-500 mb-1"></div>
            <p className="text-xs">誤字・脱字</p>
            <p className="font-bold">0%</p>
          </div>
        </div>
        
        <h4 className="font-medium text-gray-900 mb-2">キーワード</h4>
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge className="bg-gray-100 text-gray-800">タイトル</Badge>
          <Badge className="bg-gray-100 text-gray-800">表現</Badge>
          <Badge className="bg-gray-100 text-gray-800">図表</Badge>
          <Badge className="bg-gray-100 text-gray-800">数値</Badge>
          <Badge className="bg-gray-100 text-gray-800">わかりにくい</Badge>
        </div>
        
        <h4 className="font-medium text-gray-900 mb-2">感情分析</h4>
        <div className="p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">非常にネガティブ</span>
            <span className="text-xs text-gray-500">非常にポジティブ</span>
          </div>
          <div className="mt-1 h-2 w-full bg-gray-200 rounded-full">
            <div className="h-2 bg-amber-400 rounded-full" style={{width: "45%"}}></div>
          </div>
          <p className="text-center text-xs mt-2 text-gray-600">
            中立的なフィードバック
          </p>
        </div>
      </div>
    </>
  );
};

export default AIReviewSummary;
