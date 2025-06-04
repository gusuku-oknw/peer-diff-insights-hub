// OverallReviewPanel.tsx
import React, { useState } from "react";
import OverallReviewHeader from "./OverallReviewHeader";
import OverallReviewTabs from "./OverallReviewTabs";
import OverallReviewFooter from "./OverallReviewFooter";

interface OverallReviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  totalSlides: number;
  presenterNotes?: Record<number, string>;
}

const OverallReviewPanel: React.FC<OverallReviewPanelProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 totalSlides,
                                                                 presenterNotes = {}
                                                               }) => {
  const [reviewText, setReviewText] = useState("");
  const [overallRating, setOverallRating] = useState(0);

  if (!isOpen) return null;

  // ダミーデータ
  const overallScore = 78;
  const totalComments = 24;
  const positiveComments = 18;
  const negativeComments = 6;

  const handleSubmitReview = () => {
    if (!reviewText.trim()) {
      alert("レビューを入力してください");
      return;
    }
    console.log("Submitting overall review:", { reviewText, overallRating });
    alert("全体レビューを投稿しました");
    setReviewText("");
    setOverallRating(0);
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-[1000px] h-[700px] flex flex-col overflow-hidden">
          {/* ヘッダー */}
          <OverallReviewHeader totalSlides={totalSlides} onClose={onClose} />

          {/* タブ＆コンテンツ */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <OverallReviewTabs
                overallScore={overallScore}
                totalComments={totalComments}
                positiveComments={positiveComments}
                negativeComments={negativeComments}
                reviewText={reviewText}
                setReviewText={setReviewText}
                overallRating={overallRating}
                setOverallRating={setOverallRating}
                onSubmitReview={handleSubmitReview}
                presenterNotes={presenterNotes}
            />
          </div>

          {/* フッター */}
          <OverallReviewFooter />
        </div>
      </div>
  );
};

export default OverallReviewPanel;
