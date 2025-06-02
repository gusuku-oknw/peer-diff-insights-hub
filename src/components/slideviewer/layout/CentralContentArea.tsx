
import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
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

    // Calculate size percentage based on thumbnailsHeight
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    const thumbnailSizePercentage = Math.min(40, Math.max(10, (thumbnailsHeight / windowHeight) * 100));

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

    if (!showThumbnails) {
        return (
            <div className="flex-1 flex flex-col overflow-hidden min-w-0 h-full">
                {mainContent}
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 h-full">
            <ResizablePanelGroup direction="vertical" className="h-full">
                <ResizablePanel
                    defaultSize={100 - thumbnailSizePercentage}
                    minSize={60}
                    maxSize={90}
                >
                    {mainContent}
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel
                    defaultSize={thumbnailSizePercentage}
                    minSize={10}
                    maxSize={40}
                    className="border-t border-gray-200 bg-white"
                    onResize={(size) => {
                        const newHeight = (size / 100) * windowHeight;
                        setThumbnailsHeight(Math.max(100, Math.min(300, newHeight)));
                    }}
                >
                    {thumbnailsSection}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};
