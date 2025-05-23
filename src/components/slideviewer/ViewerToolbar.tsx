
import { Badge } from "@/components/ui/badge";
import { Share, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ViewerMode } from "@/stores/slideStore";
import { useSlideStore } from "@/stores/slideStore";

// Import refactored components
import ModeSelector from "./toolbar/ModeSelector";
import NavigationControls from "./toolbar/NavigationControls";
import ZoomControls from "./toolbar/ZoomControls";
import ToolsDropdown from "./toolbar/ToolsDropdown";
import ModeSpecificActions from "./toolbar/ModeSpecificActions";

interface ViewerToolbarProps {
  currentSlide: number;
  totalSlides: number;
  zoom: number;
  viewerMode: ViewerMode;
  isFullScreen: boolean;
  leftSidebarOpen: boolean;
  showPresenterNotes: boolean;
  presentationStartTime: Date | null;
  displayCount: number;
  onPreviousSlide: () => void;
  onNextSlide: () => void;
  onZoomChange: (newZoom: number) => void;
  onModeChange: (mode: ViewerMode) => void;
  onLeftSidebarToggle: () => void;
  onFullScreenToggle: () => void;
  onShowPresenterNotesToggle: () => void;
  onStartPresentation: () => void;
  onSaveChanges: () => void;
}

const ViewerToolbar = ({
  currentSlide,
  totalSlides,
  zoom,
  viewerMode,
  isFullScreen,
  leftSidebarOpen,
  showPresenterNotes,
  presentationStartTime,
  displayCount,
  onPreviousSlide,
  onNextSlide,
  onZoomChange,
  onModeChange,
  onLeftSidebarToggle,
  onFullScreenToggle,
  onShowPresenterNotesToggle,
  onStartPresentation,
  onSaveChanges
}: ViewerToolbarProps) => {
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const exportToPPTX = useSlideStore(state => state.exportToPPTX);

  const handleSendFeedback = () => {
    toast({
      title: "フィードバックが送信されました",
      description: "レビュー担当者にフィードバックが送信されました。",
      variant: "default"
    });
  };
  
  return (
    <div className="bg-white border-b border-gray-200 py-2 sm:py-3 shadow-sm flex-shrink-0 z-10">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto scrollbar-hide">
            {/* Mode switcher tabs */}
            <ModeSelector 
              currentMode={viewerMode} 
              onModeChange={onModeChange} 
            />

            <div className="h-6 border-r border-gray-200 mx-1 sm:mx-2 hidden sm:block" />

            {/* Navigation controls */}
            <NavigationControls 
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              onNextSlide={onNextSlide}
              onPreviousSlide={onPreviousSlide}
            />
            
            <div className="h-6 border-r border-gray-200 mx-1 sm:mx-2 hidden sm:block" />
            
            {/* Zoom controls */}
            <ZoomControls 
              zoom={zoom} 
              onZoomChange={onZoomChange} 
            />
            
            {/* Tools dropdown */}
            <div className="h-6 border-r border-gray-200 mx-1 sm:mx-2 hidden sm:block" />
            
            <ToolsDropdown 
              leftSidebarOpen={leftSidebarOpen}
              isFullScreen={isFullScreen}
              onLeftSidebarToggle={onLeftSidebarToggle}
              onFullScreenToggle={onFullScreenToggle}
              onExportToPPTX={exportToPPTX}
            />
          </div>
          
          <div className="flex items-center">
            {/* Role indicator badge */}
            {userProfile && (
              <Badge variant="outline" className="mr-2 sm:mr-3 text-[10px] sm:text-xs">
                {userProfile.role === "business" ? "企業ユーザー" : 
                 userProfile.role === "student" ? "学生ユーザー" : 
                 userProfile.role === "debugger" ? "デバッガー" : "ゲスト"}
              </Badge>
            )}
            
            {/* Mode-specific controls on the right */}
            <ModeSpecificActions 
              mode={viewerMode}
              displayCount={displayCount}
              isFullScreen={isFullScreen}
              showPresenterNotes={showPresenterNotes}
              onSaveChanges={onSaveChanges}
              onShowPresenterNotesToggle={onShowPresenterNotesToggle}
              onStartPresentation={onStartPresentation}
              onSendFeedback={handleSendFeedback}
            />
            
            {/* Share button always available (hidden on small screens) */}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 sm:ml-3 hidden sm:flex items-center gap-1 sm:gap-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
            >
              <Share className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              <span className="text-blue-700 text-xs sm:text-sm">共有</span>
            </Button>
            
            {/* Export to PPTX button (visible on small screens only) */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToPPTX}
              className="ml-2 sm:hidden p-1"
            >
              <FileDown className="h-4 w-4 text-blue-600" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerToolbar;
