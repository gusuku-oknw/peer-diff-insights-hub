
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Presentation, Pencil, MessageCircle, Share, Play, History, Settings, Save, Filter, ChevronRight as ChevronDown, FileDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ViewerMode } from "@/stores/slideStore";
import { useSlideStore } from "@/stores/slideStore";

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

  // Mode-specific UI elements
  const renderModeSpecificUI = () => {
    switch (viewerMode) {
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
              onClick={() => toast({
                title: "フィードバックが送信されました",
                description: "レビュー担当者にフィードバックが送信されました。",
                variant: "default"
              })}
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
  
  return (
    <div className="bg-white border-b border-gray-200 py-2 sm:py-3 shadow-sm flex-shrink-0 z-10">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto scrollbar-hide">
            {/* Mode switcher tabs */}
            <Tabs defaultValue={viewerMode} value={viewerMode} className="w-auto" onValueChange={value => onModeChange(value as ViewerMode)}>
              <TabsList className="bg-slate-100 p-0.5 sm:p-1">
                <TabsTrigger value="presentation" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white px-2 sm:px-3 py-1">
                  <Presentation className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">プレゼンテーション</span>
                </TabsTrigger>
                
                <TabsTrigger value="edit" className="data-[state=active]:bg-green-500 data-[state=active]:text-white px-2 sm:px-3 py-1">
                  <Pencil className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">編集</span>
                </TabsTrigger>
                
                <TabsTrigger value="review" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white px-2 sm:px-3 py-1">
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">レビュー</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="h-6 border-r border-gray-200 mx-1 sm:mx-2 hidden sm:block" />

            {/* Primary controls - always visible */}
            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onPreviousSlide} 
                    disabled={currentSlide === 1} 
                    className="rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center hover:bg-blue-50"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>前のスライド (←)</TooltipContent>
              </Tooltip>
              
              <span className="text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md border border-blue-100 min-w-[50px] sm:min-w-[60px] text-center">
                {currentSlide} / {totalSlides}
              </span>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onNextSlide} 
                    disabled={currentSlide === totalSlides} 
                    className="rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center hover:bg-blue-50"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>次のスライド (→)</TooltipContent>
              </Tooltip>
            </div>
            
            <div className="h-6 border-r border-gray-200 mx-1 sm:mx-2 hidden sm:block" />
            
            {/* Zoom controls */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <span className="font-medium">{zoom}%</span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>ズーム設定</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onZoomChange(50)}>50%</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onZoomChange(75)}>75%</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onZoomChange(100)}>100% (デフォルト)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onZoomChange(125)}>125%</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onZoomChange(150)}>150%</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onZoomChange(200)}>200%</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              onClick={() => onZoomChange(zoom - 10)} 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center hover:bg-blue-50"
            >
              <span className="font-medium">-</span>
            </Button>
            
            <Button 
              onClick={() => onZoomChange(zoom + 10)} 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center hover:bg-blue-50"
            >
              <span className="font-medium">+</span>
            </Button>
            
            {/* Secondary tools dropdown (advanced features) */}
            <div className="h-6 border-r border-gray-200 mx-1 sm:mx-2 hidden sm:block" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden md:inline">詳細ツール</span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={onLeftSidebarToggle}>
                  <History className="h-4 w-4 mr-2" />
                  {leftSidebarOpen ? "履歴を隠す" : "履歴を表示"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="mr-2">XML Diffビュー</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToPPTX}>
                  <FileDown className="h-4 w-4 mr-2" />
                  <span>PPTXとしてエクスポート</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onFullScreenToggle}>
                  <span className="mr-2">{isFullScreen ? "全画面終了" : "全画面表示"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            {renderModeSpecificUI()}
            
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
