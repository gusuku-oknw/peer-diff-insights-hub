
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PanelRightOpen, MessageSquare, FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSlideStore } from "@/stores/slide.store";

interface RightFloatingButtonProps {
  onToggle: () => void;
}

const RightFloatingButton: React.FC<RightFloatingButtonProps> = ({ onToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { viewerMode, showPresenterNotes } = useSlideStore();

  // パネルのタイプを判定
  const getPanelInfo = () => {
    const shouldShowNotes = (viewerMode === "presentation" && showPresenterNotes) || 
                           (viewerMode === "review" && showPresenterNotes);
    const shouldShowReviewPanel = viewerMode === "review";
    
    if (shouldShowNotes && shouldShowReviewPanel) {
      return { icon: MessageSquare, label: "パネル" };
    } else if (shouldShowNotes) {
      return { icon: FileText, label: "ノート" };
    } else if (shouldShowReviewPanel) {
      return { icon: MessageSquare, label: "レビュー" };
    }
    return { icon: PanelRightOpen, label: "パネル" };
  };

  const { icon: PanelIcon, label } = getPanelInfo();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="fixed right-0 top-32 z-50 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className={`
              h-16 bg-white hover:bg-gray-50 border-2 border-r-0 
              shadow-lg transition-all duration-300 ease-out
              rounded-r-none rounded-l-lg
              flex flex-col items-center justify-center gap-1
              ${isHovered ? 'w-20 px-2' : 'w-8 px-1'}
            `}
            title="右パネルを表示"
          >
            <PanelIcon className="h-4 w-4 text-gray-600" />
            {isHovered && (
              <span className="text-xs text-gray-600 font-medium leading-tight">
                {label}
              </span>
            )}
          </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>右パネルを表示</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default RightFloatingButton;
