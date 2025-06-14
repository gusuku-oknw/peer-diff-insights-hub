
import React from "react";
import { Button } from "@/components/ui/button";
import { X, BookOpen, MessageSquare } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PanelHeaderProps {
  shouldShowNotes: boolean;
  shouldShowReviewPanel: boolean;
  isVeryNarrow: boolean;
  isMobile: boolean;
  onToggleHide?: () => void;
  onSheetClose?: () => void;
}

/**
 * パネルヘッダーコンポーネント
 * - ノートとレビューパネルのタブ切り替え
 * - レスポンシブ対応（モバイル・デスクトップ）
 * - パネル開閉制御
 */
const PanelHeader: React.FC<PanelHeaderProps> = ({
  shouldShowNotes,
  shouldShowReviewPanel,
  isVeryNarrow,
  isMobile,
  onToggleHide,
  onSheetClose
}) => {
  return (
    <div className={`${isVeryNarrow ? 'px-2 py-1' : 'px-4 py-2'} border-b border-gray-200 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 relative z-20`}>
      <TabsList className="grid grid-cols-2 flex-1 min-w-0 bg-white shadow-sm">
        {shouldShowNotes && (
          <TabsTrigger 
            value="notes" 
            className={`flex items-center gap-1 ${isVeryNarrow ? 'px-1' : 'px-2'} min-w-0 transition-all hover:bg-blue-50 data-[state=active]:bg-blue-100`}
          >
            <BookOpen className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} flex-shrink-0 text-blue-600`} />
            {!isVeryNarrow && <span className="truncate font-medium">メモ</span>}
          </TabsTrigger>
        )}
        {shouldShowReviewPanel && (
          <TabsTrigger 
            value="reviews" 
            className={`flex items-center gap-1 ${isVeryNarrow ? 'px-1' : 'px-2'} min-w-0 transition-all hover:bg-purple-50 data-[state=active]:bg-purple-100`}
          >
            <MessageSquare className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} flex-shrink-0 text-purple-600`} />
            {!isVeryNarrow && <span className="truncate font-medium">レビュー</span>}
          </TabsTrigger>
        )}
      </TabsList>
      
      {!isMobile && onToggleHide && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleHide}
          className={`ml-2 ${isVeryNarrow ? 'h-6 w-6 p-0' : 'h-8 w-8 p-0'} flex-shrink-0 hover:bg-gray-200 transition-colors relative z-30`}
          title="パネルを閉じる"
        >
          <X className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} text-gray-600`} />
        </Button>
      )}
      
      {isMobile && onSheetClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSheetClose}
          className="ml-2 h-8 w-8 p-0 flex-shrink-0 hover:bg-gray-200 transition-colors relative z-30"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default PanelHeader;
