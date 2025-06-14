
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PanelHeaderProps {
  isVeryNarrow: boolean;
  isMobile: boolean;
  onToggleHide?: () => void;
  // Removed props related to tabs
}

const PanelHeader: React.FC<PanelHeaderProps> = ({
  isVeryNarrow,
  isMobile,
  onToggleHide
}) => {
  // Just the close button and style, NO TabsList or triggers
  return (
    <div className={`${isVeryNarrow ? 'px-2 py-1' : 'px-4 py-2'} border-b border-gray-200 flex items-center justify-end flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 relative z-20`}>
      {!isMobile && onToggleHide && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleHide}
          className="h-8 w-8 p-0 flex-shrink-0 hover:bg-gray-200 transition-colors relative z-30"
          title="パネルを閉じる"
        >
          <X className="h-4 w-4 text-gray-600" />
        </Button>
      )}
    </div>
  );
};

export default PanelHeader;
