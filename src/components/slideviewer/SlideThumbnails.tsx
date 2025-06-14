import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSlideStore } from "@/stores/slide-store";
import { useResponsiveThumbnails } from "@/hooks/slideviewer/useResponsiveThumbnails";
import UnifiedSlideThumbnails from "./thumbnails/UnifiedSlideThumbnails";
import EnhancedSlideThumbnails from "./thumbnails/EnhancedSlideThumbnails";
import ImprovedSlideThumbnails from "./thumbnails/ImprovedSlideThumbnails";
import SimplifiedSlideThumbnails from "./thumbnails/SimplifiedSlideThumbnails";
import SimplifiedThumbnailHeader from "./thumbnails/SimplifiedThumbnailHeader";
import ThumbnailNavigationButtons from "./thumbnails/ThumbnailNavigationButtons";
import ThumbnailScrollArea from "./thumbnails/ThumbnailScrollArea";
import { useThumbnailContainer } from "./thumbnails/ThumbnailContainer";

interface SlideThumbnailsProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  height: number;
  containerWidth: number;
  userType?: "student" | "enterprise";
  enhanced?: boolean;
  showAsPopup?: boolean;
  // 新しいプロパティ：改善版UI/UXを使用するかどうか
  useImprovedUI?: boolean;
}

const SlideThumbnails = ({
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  height,
  containerWidth,
  userType = "enterprise",
  enhanced = false,
  showAsPopup = false,
  useImprovedUI = true // デフォルトで改善版を使用
}: SlideThumbnailsProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { slides } = useSlideStore();

  // レスポンシブ判定
  const { shouldUsePopup, optimalHeight } = useResponsiveThumbnails({
    containerWidth,
    isPopupMode: false
  });

  // 強制ポップアップまたは自動判定でポップアップを使用
  const usePopupMode = showAsPopup || shouldUsePopup;

  // ポップアップモードの場合
  if (usePopupMode) {
    return (
      <>
        {/* ポップアップ開くトリガーボタン */}
        <div className="flex items-center justify-center p-4 border-t border-gray-200 bg-white">
          <Button
            onClick={() => setIsPopupOpen(true)}
            variant="outline"
            className="w-full max-w-sm"
          >
            スライド一覧を表示 ({currentSlide}/{slides.length})
          </Button>
        </div>
        
        {/* ポップアップ */}
        <SimplifiedSlideThumbnails
          currentSlide={currentSlide}
          onSlideClick={onSlideClick}
          onOpenOverallReview={onOpenOverallReview}
          containerWidth={containerWidth}
          userType={userType}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      </>
    );
  }

  // デフォルトで新しいUnifiedSlideThumbnailsを使用
  return (
    <UnifiedSlideThumbnails
      currentSlide={currentSlide}
      onSlideClick={onSlideClick}
      onOpenOverallReview={onOpenOverallReview}
      height={Math.max(height, optimalHeight)}
      containerWidth={containerWidth}
      userType={userType}
    />
  );
};

export default SlideThumbnails;
