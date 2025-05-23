
import React, { useState, useEffect } from "react";
import SlideThumbnails from "@/components/slideviewer/SlideThumbnails";
import SidePanel from "@/components/slide-viewer/panels/SidePanel";
import { useToast } from "@/hooks/use-toast";
import { useSlideStore } from "@/stores/slideStore";
import LeftSidebar from "./LeftSidebar";
import MainContent from "./MainContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

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
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
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

  const toggleRightPanelCollapse = () => {
    setIsRightPanelCollapsed(!isRightPanelCollapsed);
  };

  // Determine if we should show the right side panel
  const shouldShowRightSidePanel = (
    viewerMode === "review" || 
    (showPresenterNotes && viewerMode !== "edit")
  );
  
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Overlay for sidebar - ONLY on mobile */}
      {leftSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onToggleLeftSidebar}
        />
      )}

      {/* Main horizontal layout */}
      <div className="flex flex-grow overflow-hidden relative">
        {/* Left Sidebar */}
        <LeftSidebar
          leftSidebarOpen={leftSidebarOpen}
          currentBranch={currentBranch}
          branches={branches}
          commitHistory={commitHistory}
          onBranchChange={onBranchChange}
        />

        {/* Main Content Area with Resizable Panels */}
        <div className={`flex-1 flex transition-all duration-300 ${leftSidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}`}>
          {shouldShowRightSidePanel && !isMobile ? (
            <ResizablePanelGroup direction="horizontal" className="flex-1">
              {/* Main Content Panel */}
              <ResizablePanel 
                defaultSize={isRightPanelCollapsed ? 95 : 70} 
                minSize={50}
                maxSize={isRightPanelCollapsed ? 95 : 85}
              >
                <div className="flex flex-col h-full">
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
                </div>
              </ResizablePanel>

              {/* Resizable Handle - only show when panel is not collapsed */}
              {!isRightPanelCollapsed && <ResizableHandle withHandle />}

              {/* Right Side Panel */}
              <ResizablePanel 
                defaultSize={isRightPanelCollapsed ? 5 : 30} 
                minSize={isRightPanelCollapsed ? 5 : 20} 
                maxSize={isRightPanelCollapsed ? 5 : 50}
              >
                <SidePanel
                  shouldShowNotes={showPresenterNotes}
                  shouldShowReviewPanel={viewerMode === "review"}
                  currentSlide={currentSlide}
                  totalSlides={totalSlides}
                  presenterNotes={presenterNotes}
                  isCollapsed={isRightPanelCollapsed}
                  onToggleCollapse={toggleRightPanelCollapse}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="flex flex-col h-full flex-1">
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
              
              {/* Show SidePanel for mobile */}
              {shouldShowRightSidePanel && isMobile && (
                <SidePanel
                  shouldShowNotes={showPresenterNotes}
                  shouldShowReviewPanel={viewerMode === "review"}
                  currentSlide={currentSlide}
                  totalSlides={totalSlides}
                  presenterNotes={presenterNotes}
                />
              )}
            </div>
          )}
        </div>
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
