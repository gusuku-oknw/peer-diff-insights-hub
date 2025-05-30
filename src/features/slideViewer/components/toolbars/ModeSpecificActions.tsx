
import { Button } from "@/components/ui/button";
import { ViewerMode } from "@/stores/slideStore";
import { Save, Filter, Presentation, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ModeSpecificActionsProps {
  mode: ViewerMode;
  displayCount: number;
  isFullScreen: boolean;
  showPresenterNotes: boolean;
  userType: "student" | "enterprise";
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
  userType,
  onSaveChanges,
  onShowPresenterNotesToggle,
  onStartPresentation,
  onSendFeedback
}: ModeSpecificActionsProps) => {
  const { toast } = useToast();

  const handleSendFeedback = () => {
    if (userType === "enterprise") {
      toast({
        title: "権限がありません",
        description: "企業ユーザーはフィードバックの送信はできません",
        variant: "destructive"
      });
      return;
    }

    if (onSendFeedback) {
      onSendFeedback();
    } else {
      toast({
        title: "フィードバック送信",
        description: "フィードバックを送信しました",
        variant: "default"
      });
    }
  };
  
  console.log('ModeSpecificActions render:', { mode, userType });
  
  switch (mode) {
    case "edit":
      // Only enterprise users can see edit mode actions
      if (userType !== "enterprise") return null;
      
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
          {/* Only students can send feedback */}
          {userType === "student" && (
            <Button 
              variant="default" 
              size="sm" 
              className="bg-purple-600 hover:bg-purple-700 text-white p-1 sm:p-2" 
              onClick={handleSendFeedback}
            >
              <span className="text-xs sm:text-sm">フィードバック送信</span>
            </Button>
          )}
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
