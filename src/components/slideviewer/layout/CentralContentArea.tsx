
import React from "react";
import { ResizablePanel } from "./ResizablePanel";
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
        <div className="border-t border-gray-200 bg-white h-full">
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
                <div className="flex flex-col h-full">
                    <div className="flex-1 min-h-0">
                        {mainContent}
                    </div>
                    <ResizablePanel
                        initialWidth={thumbnailsHeight}
                        minWidth={100}
                        maxWidth={300}
                        onWidthChange={setThumbnailsHeight}
                        className="border-t border-gray-200 bg-white"
                        orientation="horizontal"
                        resizePosition="top"
                    >
                        {thumbnailsSection}
                    </ResizablePanel>
                </div>
            ) : (
                mainContent
            )}
        </div>
    );
};
