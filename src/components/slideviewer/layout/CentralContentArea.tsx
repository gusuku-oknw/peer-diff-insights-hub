import React from "react";
import { ResizablePanel } from "./ResizablePanel";
import MainContent from "./MainContent";
import SlideThumbnails from "@/components/slideviewer/SlideThumbnails";
import { useSlideStore } from "@/stores/slide-store";
import type { ViewerMode } from "@/types/slide.types";

interface CentralContentAreaProps {
    /* ... 省略 ... */
}

export const CentralContentArea: React.FC<CentralContentAreaProps> = ({
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
                                                                      }) => {
    const { thumbnailsHeight, setThumbnailsHeight, getSlideThumbnailsWidth } =
        useSlideStore();
    const thumbnailsWidth = getSlideThumbnailsWidth();

    return (
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/*
        1) MainContent をこの領域でスクロールさせる
      */}
            <div className="flex-1 overflow-auto">
                <MainContent
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
                />
            </div>

            {/*
        2) 下部サムネイルは flex-none で固定
           orientation="horizontal" + resizePosition="top"
      */}
            {!(viewerMode === "presentation" && isFullScreen) && (
                <ResizablePanel
                    initialSize={thumbnailsHeight}
                    minSize={100}
                    maxSize={300}
                    onSizeChange={setThumbnailsHeight}
                    orientation="horizontal"   // 「高さ」を変える
                    resizePosition="top"        // 上端ハンドル
                    className="flex-none border-t border-gray-200 bg-white"
                >
                    <SlideThumbnails
                        currentSlide={currentSlide}
                        onSlideClick={onSlideChange}
                        onOpenOverallReview={onOpenOverallReview}
                        height={thumbnailsHeight}
                        userType={userType}
                    />
                </ResizablePanel>
            )}
        </div>
    );
};
