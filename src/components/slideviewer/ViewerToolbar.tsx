
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, ChevronRight, Book, Pencil, MessageCircle, 
  Share, Play, History, Settings, Save, Filter, ChevronRight as ChevronDown 
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

type ViewerMode = "notes" | "edit" | "review";
type UserType = "student" | "enterprise";

interface ViewerToolbarProps {
  currentSlide: number;
  totalSlides: number;
  zoom: number;
  viewerMode: ViewerMode;
  userType: UserType;
  isFullScreen: boolean;
  leftSidebarOpen: boolean;
  showPresenterNotes: boolean;
  presentationStartTime: Date | null;
  
  onPreviousSlide: () => void;
  onNextSlide: () => void;
  onZoomChange: (newZoom: number) => void;
  onModeChange: (mode: ViewerMode) => void;
  onUserTypeToggle: () => void;
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
  userType,
  isFullScreen,
  leftSidebarOpen,
  showPresenterNotes,
  presentationStartTime,
  onPreviousSlide,
  onNextSlide,
  onZoomChange,
  onModeChange,
  onUserTypeToggle,
  onLeftSidebarToggle,
  onFullScreenToggle,
  onShowPresenterNotesToggle,
  onStartPresentation,
  onSaveChanges
}: ViewerToolbarProps) => {
  const { toast } = useToast();
  
  // Mode-specific UI elements
  const renderModeSpecificUI = () => {
    switch (viewerMode) {
      case "edit":
        return (
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <span className="hidden lg:inline">テンプレート</span>
            </Button>
            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={onSaveChanges}>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </div>
        );
      case "review":
        return (
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden lg:inline">フィルター</span>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => toast({
                title: "フィードバックが送信されました",
                description: "レビュー担当者にフィードバックが送信されました。",
                variant: "default"
              })}
            >
              フィードバック送信
            </Button>
          </div>
        );
      case "notes":
        return (
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2" 
              onClick={onShowPresenterNotesToggle}
            >
              <Book className="h-4 w-4" />
              <span className="hidden lg:inline">発表者メモ {showPresenterNotes ? '非表示' : '表示'}</span>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onStartPresentation}
            >
              <Play className="h-4 w-4 mr-2" />
              プレゼン開始（全画面）
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 py-3 shadow-sm flex-shrink-0 z-10">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mode switcher tabs */}
            <Tabs 
              defaultValue={viewerMode} 
              value={viewerMode} 
              className="w-auto" 
              onValueChange={(value) => onModeChange(value as ViewerMode)}
            >
              <TabsList className="bg-slate-100 p-1">
                <TabsTrigger 
                  value="notes" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  <Book className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">メモ・台本</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="edit" 
                  className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">編集</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="review" 
                  className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">レビュー</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="h-6 border-r border-gray-200 mx-2" />

            {/* Primary controls - always visible */}
            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onPreviousSlide} 
                    disabled={currentSlide === 1} 
                    className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-blue-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>前のスライド (←)</TooltipContent>
              </Tooltip>
              
              <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-md border border-blue-100 min-w-[60px] text-center">
                {currentSlide} / {totalSlides}
              </span>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onNextSlide} 
                    disabled={currentSlide === totalSlides} 
                    className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-blue-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>次のスライド (→)</TooltipContent>
              </Tooltip>
            </div>
            
            <div className="h-6 border-r border-gray-200 mx-2" />
            
            {/* Zoom controls */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <span className="text-sm font-medium">{zoom}%</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>ズーム設定</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onZoomChange(50)}>
                  50%
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onZoomChange(75)}>
                  75%
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onZoomChange(100)}>
                  100% (デフォルト)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onZoomChange(125)}>
                  125%
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onZoomChange(150)}>
                  150%
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onZoomChange(200)}>
                  200%
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button onClick={() => onZoomChange(zoom - 10)} variant="ghost" size="icon" className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-blue-50">
              <span className="font-medium">-</span>
            </Button>
            
            <Button onClick={() => onZoomChange(zoom + 10)} variant="ghost" size="icon" className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-blue-50">
              <span className="font-medium">+</span>
            </Button>
            
            {/* User type switch for demo purposes */}
            <div className="h-6 border-r border-gray-200 mx-2" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onUserTypeToggle}
              className="flex items-center gap-2"
            >
              <span className="text-xs font-medium">
                {userType === "student" ? "学生" : "企業"} UI
              </span>
              <Badge variant="secondary" className={userType === "student" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                {userType === "student" ? "学生" : "企業"}
              </Badge>
            </Button>
            
            {/* Secondary tools dropdown (advanced features) */}
            <div className="h-6 border-r border-gray-200 mx-2" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden md:inline">詳細ツール</span>
                  <ChevronDown className="h-4 w-4" />
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
                <DropdownMenuItem>
                  <span className="mr-2">エクスポート</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onFullScreenToggle}>
                  <span className="mr-2">{isFullScreen ? "全画面終了" : "全画面表示"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center">
            {/* Mode-specific controls on the right */}
            {renderModeSpecificUI()}
            
            {/* Share button always available */}
            <Button variant="outline" size="sm" className="ml-3 hidden sm:flex items-center gap-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300">
              <Share className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700">共有</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerToolbar;
