
import React from "react";
import { Book, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { panelTokens } from "@/design-system/tokens/panel";

interface NotesPanelProps {
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
  panelWidth?: number;
  panelHeight?: number;
  isNarrow?: boolean;
  isVeryNarrow?: boolean;
}

const NotesPanel: React.FC<NotesPanelProps> = ({ 
  currentSlide, 
  totalSlides, 
  presenterNotes,
  panelWidth = 0,
  panelHeight = 0,
  isNarrow = false,
  isVeryNarrow = false
}) => {
  const { userProfile } = useAuth();
  
  // レスポンシブサイズクラスの決定
  const sizeClass = React.useMemo(() => {
    if (panelWidth < 320) return 'xs';
    if (panelWidth < 400) return 'sm';
    if (panelWidth < 500) return 'md';
    return 'lg';
  }, [panelWidth]);

  const isCompact = sizeClass === 'xs' || sizeClass === 'sm';
  const isShort = panelHeight > 0 && panelHeight < 400;
  
  console.log('NotesPanel enhanced layout:', { panelWidth, sizeClass, isCompact, isShort });

  const noteCardStyle = {
    borderColor: panelTokens.colors.border.light,
    backgroundColor: panelTokens.colors.background.primary
  };

  const renderNoteSection = (slideNum: number, title: string, bgColor: string, textColor: string) => {
    const noteContent = presenterNotes[slideNum];
    
    return (
      <div className={isCompact ? 'mb-2' : 'mb-4'}>
        <div 
          className={`p-1.5 rounded-t-lg border border-b-0 flex items-center ${isNarrow ? 'justify-center' : 'justify-between'} min-w-0`}
          style={{ backgroundColor: bgColor, borderColor: panelTokens.colors.border.light }}
        >
          <p className={`${isCompact ? 'text-xs' : 'text-sm'} font-medium truncate`} style={{ color: textColor }}>
            {isCompact ? (slideNum === currentSlide ? '現在' : slideNum > currentSlide ? '次' : '前') : title}
          </p>
          {!isNarrow && (
            <span 
              className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{ 
                backgroundColor: `${textColor}15`,
                color: textColor
              }}
            >
              {slideNum}
            </span>
          )}
        </div>
        
        <div 
          className={`${isCompact ? 'p-2' : 'p-4'} rounded-b-lg border min-w-0`}
          style={noteCardStyle}
        >
          {noteContent ? (
            <p className={`${isCompact ? 'text-xs leading-tight' : 'text-sm'} leading-relaxed whitespace-pre-wrap break-words ${
              isShort && slideNum !== currentSlide ? 'line-clamp-2' : ''
            }`}>
              {noteContent}
            </p>
          ) : (
            <p className={`${isCompact ? 'text-xs' : 'text-sm'} text-gray-500 italic`}>
              {isCompact ? 'メモなし' : 'このスライドにはメモがありません'}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-white shadow-sm flex flex-col min-w-0">
      <ScrollArea className="flex-grow min-h-0">
        <div className={`${isCompact ? 'p-2' : 'p-4'} flex flex-col h-full min-w-0`} style={{ minHeight: 'fit-content' }}>
          
          {/* 現在のスライドのメモ */}
          {renderNoteSection(
            currentSlide, 
            '現在のスライド',
            panelTokens.tabColors.notes.background,
            panelTokens.tabColors.notes.primary
          )}
          
          {/* ナビゲーションヒント */}
          {!isCompact && !isShort && (
            <div className="grid grid-cols-1 gap-2 mb-4">
              <div className="flex justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  <ChevronUp className="h-3 w-3 mr-1" /> 前のスライド (←)
                </span>
                <span className="flex items-center">
                  次のスライド (→) <ChevronDown className="h-3 w-3 ml-1" />
                </span>
              </div>
            </div>
          )}
          
          {/* 次のスライドのプレビュー */}
          {currentSlide < totalSlides && !isShort && (
            renderNoteSection(
              currentSlide + 1,
              '次のスライド',
              panelTokens.colors.background.accent,
              panelTokens.colors.text.secondary
            )
          )}

          {/* 前のスライドの参照 */}
          {currentSlide > 1 && !isCompact && !isShort && (
            renderNoteSection(
              currentSlide - 1,
              '前のスライド',
              panelTokens.colors.background.secondary,
              panelTokens.colors.text.muted
            )
          )}
          
          {/* プレゼンテーションのヒント */}
          {!isNarrow && !isShort && sizeClass !== 'sm' && (
            <div className="mt-auto pt-4 border-t" style={{ borderColor: panelTokens.colors.border.light }}>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                プレゼンテーションのヒント
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 聴衆の方を見て話すようにしましょう</li>
                <li>• スライドを読み上げるのではなく、説明するよう心がけましょう</li>
                <li>• 質問がある場合は、スライドの最後に受け付けることを伝えましょう</li>
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotesPanel;
