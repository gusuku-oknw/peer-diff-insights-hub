
import React, { useState, useEffect } from "react";
import SlideThumbnails from "@/components/slideviewer/SlideThumbnails";
import SidePanel from "@/components/slideviewer/panels/SidePanel";
import { useToast } from "@/hooks/use-toast";
import { useSlideStore } from "@/stores/slideStore";
import LeftSidebar from "./LeftSidebar";
import MainContent from "./MainContent";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  currentBranch: string;
  branches: string[];
  commitHistory: any[];
  currentSlide: number;
  totalSlides: number;
  zoom: number;
  viewerMode: "presentation" | "edit" | "review";
  leftSidebarOpen: boolean;
  showPresenterNotes: boolean;
  isFullScreen: boolean;
  presentationStartTime: number | null;
  presenterNotes: Record<number, string>;
  elapsedTime: string;
  displayCount: number;
  commentedSlides: number[];
  mockComments: any;
  userType: "student" | "enterprise";
  onBranchChange: (branch: string) => void;
  onToggleLeftSidebar: () => void;
  onSlideChange: (currentSlide: number) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  currentBranch,
  branches,
  commitHistory,
  currentSlide,
  totalSlides,
  zoom,
  viewerMode,
  leftSidebarOpen,
  showPresenterNotes,
  isFullScreen,
  presentationStartTime,
  presenterNotes,
  elapsedTime,
  displayCount,
  commentedSlides,
  mockComments,
  userType,
  onBranchChange,
  onToggleLeftSidebar,
  onSlideChange
}) => {
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(mockComments[currentSlide] || []);
  const [isNotesPanelOpen, setIsNotesPanelOpen] = useState(false);
  const slides = useSlideStore(state => state.slides);
  const isMobile = useIsMobile();

  // Update comments when current slide changes
  useEffect(() => {
    setComments(mockComments[currentSlide] || []);
  }, [currentSlide, mockComments]);

  const handleAddComment = () => {
    if (commentText.trim() !== "") {
      const newComment = {
        id: Date.now(),
        text: commentText,
      };

      setComments(prevComments => [...prevComments, newComment]);
      setCommentText("");

      toast({
        title: "コメントが追加されました",
        description: "コメントありがとうございます！",
      });
    }
  };

  const handleSlideClick = (slideNumber: number) => {
    onSlideChange(slideNumber);
  };

  const toggleNotesPanel = () => {
    setIsNotesPanelOpen(!isNotesPanelOpen);
  };

  // Determine if we should show the right side panel
  const shouldShowRightSidePanel = (
    viewerMode === "review" || 
    (showPresenterNotes && viewerMode !== "edit")
  ) && !isMobile; // Don't show on mobile by default
  
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Main horizontal layout */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar
          leftSidebarOpen={leftSidebarOpen}
          currentBranch={currentBranch}
          branches={branches}
          commitHistory={commitHistory}
          onBranchChange={onBranchChange}
        />

        {/* Main Content */}
        <MainContent
          currentSlide={currentSlide}
          zoom={zoom}
          viewerMode={viewerMode}
          userType={userType}
          isNotesPanelOpen={isNotesPanelOpen}
          comments={comments}
          commentText={commentText}
          setCommentText={setCommentText}
          handleAddComment={handleAddComment}
          toggleNotesPanel={toggleNotesPanel}
        />

        {/* Right Sidebar - Conditional display */}
        {shouldShowRightSidePanel && (
          <div className="flex-shrink-0 side-panel-container" data-testid="right-side-panel">
            <SidePanel
              shouldShowNotes={showPresenterNotes}
              shouldShowReviewPanel={viewerMode === "review"}
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              presenterNotes={presenterNotes}
            />
          </div>
        )}
      </div>

      {/* Bottom Slide Thumbnails */}
      <div className="h-32 border-t border-gray-200 bg-white flex-shrink-0">
        <SlideThumbnails
          slides={slides}
          currentSlide={currentSlide}
          onSlideClick={handleSlideClick}
        />
      </div>
    </div>
  );
};

export default MainLayout;
