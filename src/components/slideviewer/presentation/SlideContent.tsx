
import React from "react";
import EnhancedSlideDisplay from "./EnhancedSlideDisplay";
import SlideThumbnails from "@/components/slideviewer/SlideThumbnails";
import { useSlideStore } from "@/stores/slide.store";
import { useResponsiveThumbnails } from "@/hooks/slideviewer/useResponsiveThumbnails";
import type { ViewerMode } from "@/types/slide.types";

interface SlideContentProps {
    currentSlide: number;
    totalSlides: number;
    zoom: number;
    viewerMode: ViewerMode;
    showPresenterNotes: boolean;
    isFullScreen: boolean;
    presentationStartTime: Date | null;
    presenterNotes: Record<number, string>;
    elapsedTime: number;
    displayCount: number;
    commentedSlides: number[];
    mockComments: any[];
    userType: "student" | "enterprise";
    onSlideChange: (slide: number) => void;
    rightPanelCollapsed: boolean;
    onOpenOverallReview: () => void;
    onZoomChange?: (zoom: number) => void;
}

const SlideContent: React.FC<SlideContentProps> = ({
    currentSlide,
    totalSlides,
    zoom,
    viewerMode,
    showPresenterNotes,
    isFullScreen,
    presentationStartTime,
    presenterNotes,
    elapsedTime,
    displayCount,
    commentedSlides,
    mockComments,
    userType,
    onSlideChange,
    rightPanelCollapsed,
    onOpenOverallReview,
    onZoomChange,
}) => {
    const { getSlideThumbnailsWidth } = useSlideStore();
    const containerWidth = getSlideThumbnailsWidth();

    // レスポンシブ判定
    const { shouldUsePopup, optimalHeight } = useResponsiveThumbnails({
        containerWidth,
        isPopupMode: false
    });

    const showThumbnails = !(viewerMode === "presentation" && isFullScreen);

    const mainContent = (
        <EnhancedSlideDisplay
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            zoom={zoom}
            viewerMode={viewerMode}
            showPresenterNotes={showPresenterNotes}
            isFullScreen={isFullScreen}
            presentationStartTime={presentationStartTime}
            presenterNotes={presenterNotes}
            elapsedTime={elapsedTime}
            displayCount={displayCount}
            commentedSlides={commentedSlides}
            mockComments={mockComments}
            userType={userType}
            rightPanelCollapsed={rightPanelCollapsed}
            onSlideChange={onSlideChange}
            onZoomChange={onZoomChange}
        />
    );

    if (!showThumbnails) {
        return (
            <div className="flex-1 flex flex-col overflow-hidden min-w-0 h-full">
                {mainContent}
            </div>
        );
    }

    // ポップアップモードの場合
    if (shouldUsePopup) {
        return (
            <div className="flex-1 flex flex-col overflow-hidden min-w-0 h-full">
                <div className="flex-1">
                    {mainContent}
                </div>
                
                <SlideThumbnails
                    currentSlide={currentSlide}
                    onSlideClick={onSlideChange}
                    onOpenOverallReview={onOpenOverallReview}
                    height={120}
                    containerWidth={containerWidth}
                    userType={userType}
                    showAsPopup={true}
                />
            </div>
        );
    }

    // デスクトップ：固定サイズのサムネイル一覧
    const thumbnailsHeight = optimalHeight;

    return (
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 h-full">
            <div 
                className="flex-1 overflow-hidden"
                style={{ height: `calc(100% - ${thumbnailsHeight}px)` }}
            >
                {mainContent}
            </div>
            
            <div 
                className="border-t border-gray-200 bg-white"
                style={{ height: `${thumbnailsHeight}px` }}
            >
                <SlideThumbnails
                    currentSlide={currentSlide}
                    onSlideClick={onSlideChange}
                    onOpenOverallReview={onOpenOverallReview}
                    height={thumbnailsHeight}
                    containerWidth={containerWidth}
                    userType={userType}
                    enhanced={false}
                />
            </div>
        </div>
    );
};

export default SlideContent;
