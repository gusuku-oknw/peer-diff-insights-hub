
import { Button } from "@/components/ui/button";
import { ViewerMode } from "@/stores/slideStore";
import { Save, Filter, Presentation, Play } from "lucide-react";

interface ModeSpecificActionsProps {
  mode: ViewerMode;
  displayCount: number;
  isFullScreen: boolean;
  showPresenterNotes: boolean;
  onSaveChanges: () => void;
  onShowPresenterNotesToggle: () => void;
  onStartPresentation: () => void;
  onSendFeedback?: () => void;
}

const ModeSpecificActions = ({
  mode,
  displayCount,
  isFullScreen,
  showPresenterNotes,
  onSaveChanges,
  onShowPresenterNotesToggle,
  onStartPresentation,
  onSendFeedback
}: ModeSpecificActionsProps) => {
  
  switch (mode) {
    case "edit":
      return (
        <div className="flex items-center space-x-2">
          <Button 
            variant="default" 
            size="sm" 
            className="bg-green-600 hover:bg-green-700 text-white" 
            onClick={onSaveChanges}
          >
            <Save className="h-4 w-4 mr-2 hidden sm:inline" />
            保存
          </Button>
        </div>
      );
    case "review":
      return (
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden md:inline">フィルター</span>
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-purple-600 hover:bg-purple-700 text-white p-1 sm:p-2" 
            onClick={onSendFeedback}
          >
            <span className="text-xs sm:text-sm">フィードバック送信</span>
          </Button>
        </div>
      );
    case "presentation":
      return (
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2" 
            onClick={onShowPresenterNotesToggle} 
            disabled={displayCount < 2 && isFullScreen}
          >
            <Presentation className="h-4 w-4" />
            <span className="hidden md:inline">
              発表者メモ {showPresenterNotes ? '非表示' : '表示'}
            </span>
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white p-1 sm:p-2" 
            onClick={onStartPresentation}
          >
            <Play className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">プレゼン開始</span>
          </Button>
        </div>
      );
    default:
      return null;
  }
};

export default ModeSpecificActions;
