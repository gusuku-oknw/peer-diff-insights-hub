
import React from "react";
import { Badge } from "@/components/ui/badge";

interface AIReviewSummaryProps {
  slideId: number;
}

const AIReviewSummary = ({ slideId }: AIReviewSummaryProps) => {
  return (
    <div className="space-y-4">
      <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
        <h4 className="font-medium text-purple-900 mb-2">要点まとめ</h4>
        <p className="text-sm text-purple-800">
          {slideId === 1 && "タイトルスライドは明確で視認性が高いという評価がある一方、会社ロゴの配置改善の提案があります。全体的には好印象です。"}
          {slideId === 2 && "会社概要の説明が簡潔でわかりやすいという評価がありますが、より具体的な数字を追加して説得力を高めることが提案されています。"}
          {slideId === 3 && "グラフの色使いについて改善が必要という指摘があります。特にコントラストを高めるか異なる色を検討することが推奨されています。"}
          {slideId === 4 && "戦略の説明が明確で理解しやすいという評価がありますが、具体的な実行計画やタイムラインの追加が提案されています。"}
          {slideId === 5 && "このスライドに対するレビューはまだありません。"}
          {slideId > 5 && "このスライドに対するレビューデータがありません。"}
        </p>
      </div>
      
      <h4 className="font-medium text-gray-900 mb-2">カテゴリ分布</h4>
      <div className="flex mb-6">
        <div className="flex-1 text-center p-2">
          <div className="inline-block w-3 h-3 rounded-full bg-blue-500 mb-1"></div>
          <p className="text-xs">内容</p>
          <p className="font-bold">
            {slideId === 1 && "40%"}
            {slideId === 2 && "70%"}
            {slideId === 3 && "20%"}
            {slideId === 4 && "60%"}
            {slideId === 5 && "0%"}
            {slideId > 5 && "0%"}
          </p>
        </div>
        <div className="flex-1 text-center p-2">
          <div className="inline-block w-3 h-3 rounded-full bg-purple-500 mb-1"></div>
          <p className="text-xs">デザイン</p>
          <p className="font-bold">
            {slideId === 1 && "60%"}
            {slideId === 2 && "20%"}
            {slideId === 3 && "80%"}
            {slideId === 4 && "10%"}
            {slideId === 5 && "0%"}
            {slideId > 5 && "0%"}
          </p>
        </div>
        <div className="flex-1 text-center p-2">
          <div className="inline-block w-3 h-3 rounded-full bg-green-500 mb-1"></div>
          <p className="text-xs">誤字・脱字</p>
          <p className="font-bold">
            {slideId === 1 && "0%"}
            {slideId === 2 && "10%"}
            {slideId === 3 && "0%"}
            {slideId === 4 && "30%"}
            {slideId === 5 && "0%"}
            {slideId > 5 && "0%"}
          </p>
        </div>
      </div>
      
      <h4 className="font-medium text-gray-900 mb-2">キーワード</h4>
      <div className="flex flex-wrap gap-2 mb-6">
        {slideId === 1 && (
          <>
            <Badge className="bg-gray-100 text-gray-800">タイトル</Badge>
            <Badge className="bg-gray-100 text-gray-800">視認性</Badge>
            <Badge className="bg-gray-100 text-gray-800">ロゴ</Badge>
            <Badge className="bg-gray-100 text-gray-800">配置</Badge>
          </>
        )}
        {slideId === 2 && (
          <>
            <Badge className="bg-gray-100 text-gray-800">会社概要</Badge>
            <Badge className="bg-gray-100 text-gray-800">簡潔</Badge>
            <Badge className="bg-gray-100 text-gray-800">数字</Badge>
            <Badge className="bg-gray-100 text-gray-800">説得力</Badge>
          </>
        )}
        {slideId === 3 && (
          <>
            <Badge className="bg-gray-100 text-gray-800">グラフ</Badge>
            <Badge className="bg-gray-100 text-gray-800">色使い</Badge>
            <Badge className="bg-gray-100 text-gray-800">コントラスト</Badge>
            <Badge className="bg-gray-100 text-gray-800">視認性</Badge>
          </>
        )}
        {slideId === 4 && (
          <>
            <Badge className="bg-gray-100 text-gray-800">戦略</Badge>
            <Badge className="bg-gray-100 text-gray-800">説明</Badge>
            <Badge className="bg-gray-100 text-gray-800">実行計画</Badge>
            <Badge className="bg-gray-100 text-gray-800">タイムライン</Badge>
          </>
        )}
        {(slideId === 5 || slideId > 5) && (
          <Badge className="bg-gray-100 text-gray-800">データなし</Badge>
        )}
      </div>
      
      <h4 className="font-medium text-gray-900 mb-2">感情分析</h4>
      <div className="p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">非常にネガティブ</span>
          <span className="text-xs text-gray-500">非常にポジティブ</span>
        </div>
        <div className="mt-1 h-2 w-full bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-amber-400 rounded-full" 
            style={{
              width: slideId === 1 ? "75%" : 
                     slideId === 2 ? "65%" : 
                     slideId === 3 ? "35%" : 
                     slideId === 4 ? "70%" : "0%"
            }}
          ></div>
        </div>
        <p className="text-center text-xs mt-2 text-gray-600">
          {slideId === 1 && "概ねポジティブなフィードバック"}
          {slideId === 2 && "やや肯定的なフィードバック"}
          {slideId === 3 && "改善を求めるフィードバック"}
          {slideId === 4 && "好意的なフィードバック"}
          {(slideId === 5 || slideId > 5) && "データなし"}
        </p>
      </div>
    </div>
  );
};

export default AIReviewSummary;
