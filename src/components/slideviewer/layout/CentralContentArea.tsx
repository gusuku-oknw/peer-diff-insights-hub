
import React from "react";
import { SplitPaneLayout } from "./sections/SplitPaneLayout";
import MainContent from "./MainContent";
import SlideThumbnails from "@/components/slideviewer/SlideThumbnails";
import { useSlideStore } from "@/stores/slide-store";
import type { ViewerMode } from "@/types/slide.types";

interface CentralContentAreaProps {
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
    const { thumbnailsHeight, setThumbnailsHeight, getSlideThumbnailsWidth } = useSlideStore();

    const showThumbnails = !(viewerMode === "presentation" && isFullScreen);
    const containerWidth = getSlideThumbnailsWidth();

    const mainContent = (
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
    );

    const thumbnailsSection = (
        <div className="border-t border-gray-200 bg-white">
            <SlideThumbnails
                currentSlide={currentSlide}
                onSlideClick={onSlideChange}
                onOpenOverallReview={onOpenOverallReview}
                height={thumbnailsHeight}
                containerWidth={containerWidth}
                userType={userType}
            />
        </div>
    );

    return (
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 h-full">
            {showThumbnails ? (
                <SplitPaneLayout
                    split="horizontal"
                    primary="first"
                    minSize={300}
                    maxSize={-100}
                    defaultSize={`calc(100% - ${thumbnailsHeight}px)`}
                    size={`calc(100% - ${thumbnailsHeight}px)`}
                    onDragFinished={(size) => {
                        const containerHeight = window.innerHeight - 64; // Navigation height
                        const newThumbnailsHeight = containerHeight - size;
                        setThumbnailsHeight(Math.max(100, Math.min(300, newThumbnailsHeight)));
                    }}
                    allowResize={true}
                    resizerStyle={{ 
                        backgroundColor: '#e5e7eb', 
                        height: '4px',
                        cursor: 'row-resize'
                    }}
                    firstPane={mainContent}
                    secondPane={thumbnailsSection}
                />
            ) : (
                mainContent
            )}
        </div>
    );
};
