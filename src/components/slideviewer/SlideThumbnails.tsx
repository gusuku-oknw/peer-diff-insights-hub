
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSlideStore } from "@/stores/slide-store";
import { useResponsiveLayout } from "@/hooks/slideviewer/useResponsiveLayout";
import { useThumbnailMode } from "@/hooks/slideviewer/useThumbnailMode";
import UnifiedSlideThumbnails from "./thumbnails/UnifiedSlideThumbnails";
import SimplifiedSlideThumbnails from "./thumbnails/SimplifiedSlideThumbnails";

interface SlideThumbnailsProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  height: number;
  containerWidth: number;
  userType?: "student" | "enterprise";
  enhanced?: boolean;
  showAsPopup?: boolean;
  useImprovedUI?: boolean;
}

/**
 * メインのスライドサムネイル表示コンポーネント
 * レスポンシブ対応で、画面サイズに応じてポップアップモードまたは固定モードを選択
 */
const SlideThumbnails = ({
  currentSlide,
  onSlideClick,
  onOpenOverallReview,
  height,
  containerWidth,
  userType = "enterprise",
  showAsPopup = false
}: SlideThumbnailsProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { slides } = useSlideStore();
  const { contentAreaDimensions } = useResponsiveLayout();

  // 効果的なコンテナ幅の計算
  const effectiveContainerWidth = containerWidth || contentAreaDimensions.thumbnailsWidth;
  
  // サムネイル表示モードの判定
  const { usePopupMode, enhancedHeight } = useThumbnailMode({
    containerWidth: effectiveContainerWidth,
    showAsPopup
  });

  console.log('SlideThumbnails rendering:', {
    containerWidth,
    effectiveContainerWidth,
    usePopupMode,
    height,
    enhancedHeight
  });

  // ポップアップモードのレンダリング
  if (usePopupMode) {
    return (
      <>
        {/* ポップアップ開閉ボタン - simplified text */}
        <div className="flex items-center justify-center p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <Button
            onClick={() => setIsPopupOpen(true)}
            variant="outline"
            className="w-full max-w-md h-12 text-base font-semibold bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <span className="flex items-center gap-2">
              📊 スライド表示
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-bold">
                {currentSlide}/{slides.length}
              </span>
            </span>
          </Button>
        </div>
        
        {/* ポップアップダイアログ */}
        <SimplifiedSlideThumbnails
          currentSlide={currentSlide}
          onSlideClick={onSlideClick}
          onOpenOverallReview={onOpenOverallReview}
          containerWidth={effectiveContainerWidth}
          userType={userType}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      </>
    );
  }

  // 固定モードのレンダリング
  return (
    <UnifiedSlideThumbnails
      currentSlide={currentSlide}
      onSlideClick={onSlideClick}
      onOpenOverallReview={onOpenOverallReview}
      height={enhancedHeight}
      containerWidth={effectiveContainerWidth}
      userType={userType}
    />
  );
};

export default SlideThumbnails;
