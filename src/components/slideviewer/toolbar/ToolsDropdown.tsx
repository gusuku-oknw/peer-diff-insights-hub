
import { Button } from "@/components/ui/button";
import { Settings, History, FileDown, ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ToolsDropdownProps {
  leftSidebarOpen: boolean;
  isFullScreen: boolean;
  onLeftSidebarToggle: () => void;
  onFullScreenToggle: () => void;
  onExportToPPTX: () => void;
}

const ToolsDropdown = ({
  leftSidebarOpen,
  isFullScreen,
  onLeftSidebarToggle,
  onFullScreenToggle,
  onExportToPPTX
}: ToolsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
        >
          <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden md:inline">詳細ツール</span>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 rotate-90" />
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
        <DropdownMenuItem onClick={onExportToPPTX}>
          <FileDown className="h-4 w-4 mr-2" />
          <span>PPTXとしてエクスポート</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onFullScreenToggle}>
          <span className="mr-2">{isFullScreen ? "全画面終了" : "全画面表示"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToolsDropdown;
