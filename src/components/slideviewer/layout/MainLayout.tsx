import React, { useState, useEffect, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SlideCanvas from "@/components/slideviewer/canvas/SlideCanvas";
import SlideThumbnails from "@/components/slideviewer/SlideThumbnails";
import CommitHistory from "@/components/slideviewer/history/CommitHistory";
import BranchSelector from "@/components/slideviewer/history/BranchSelector";
import SidePanel from "@/components/slideviewer/panels/SidePanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSlideStore } from "@/stores/slideStore";

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
  const [isCommenting, setIsCommenting] = useState(false);
  const [isNotesPanelOpen, setIsNotesPanelOpen] = useState(false);
  const slides = useSlideStore(state => state.slides);

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

  const isReviewMode = viewerMode === "review";
  const isEditMode = viewerMode === "edit";

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Sidebar */}
      <aside className={`w-64 flex-shrink-0 border-r border-gray-200 bg-gray-50 transition-transform duration-300 transform ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:block`}>
        <div className="h-full flex flex-col">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800">スライド管理</h2>
          </div>

          {/* Branch Selector */}
          <div className="px-4">
            <BranchSelector
              currentBranch={currentBranch}
              branches={branches}
              onBranchChange={onBranchChange}
            />
          </div>

          {/* Slide Thumbnails */}
          <div className="flex-grow overflow-y-auto">
            <SlideThumbnails
              slides={slides}
              currentSlide={currentSlide}
              onSlideClick={handleSlideClick}
            />
          </div>

          {/* Commit History */}
          <div className="p-4 border-t border-gray-200">
            <CommitHistory commitHistory={commitHistory} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full">
        {/* Slide Viewer */}
        <div className="flex-grow flex items-center justify-center bg-gray-100 overflow-hidden">
          <SlideCanvas
            currentSlide={currentSlide}
            zoomLevel={zoom}
            editable={isEditMode}
            userType={userType}
          />
        </div>

        {/* Review Mode UI */}
        {isReviewMode && userType === "student" && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                スライドへのコメント
              </h3>
              <Button variant="ghost" size="sm" onClick={toggleNotesPanel}>
                {isNotesPanelOpen ? "コメントを閉じる" : "コメントを開く"}
              </Button>
            </div>

            {isNotesPanelOpen ? (
              <div className="space-y-2">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white shadow-sm border rounded-md p-3">
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                ))}

                <div className="flex items-end space-x-2">
                  <div className="flex-grow">
                    <Label htmlFor="comment" className="text-xs text-gray-600">コメントを追加:</Label>
                    <Textarea
                      id="comment"
                      placeholder="スライドに関するコメントを入力してください"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <Button size="sm" onClick={handleAddComment}>
                    コメントする
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                コメントは非表示です。
              </div>
            )}
          </div>
        )}
      </main>

      {/* Right Sidebar */}
      {(viewerMode === "review" || showPresenterNotes) && (
        <SidePanel
          shouldShowNotes={showPresenterNotes}
          shouldShowReviewPanel={viewerMode === "review"}
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          presenterNotes={presenterNotes}
        />
      )}
    </div>
  );
};

export default MainLayout;
