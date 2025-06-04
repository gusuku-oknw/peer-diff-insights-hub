
import { Book, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";

interface NotesPanelProps {
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
  panelWidth?: number;
  panelHeight?: number;
  isNarrow?: boolean;
  isVeryNarrow?: boolean;
}

const NotesPanel = ({ 
  currentSlide, 
  totalSlides, 
  presenterNotes,
  panelWidth = 0,
  panelHeight = 0,
  isNarrow = false,
  isVeryNarrow = false
}: NotesPanelProps) => {
  const { userProfile } = useAuth();
  
  // Dynamic sizing based on actual panel dimensions
  const isExtremelyNarrow = panelWidth > 0 && panelWidth < 150;
  const isShort = panelHeight > 0 && panelHeight < 400;
  
  console.log('NotesPanel dimensions:', { panelWidth, panelHeight, isNarrow, isVeryNarrow, isExtremelyNarrow, isShort });
  
  return (
    <div className="h-full bg-white shadow-sm flex flex-col min-w-0">
      <div className={`${isVeryNarrow ? 'px-1 py-1' : isNarrow ? 'px-2 py-2' : 'px-4 py-3'} border-b border-gray-200 bg-blue-50 flex items-center justify-between flex-shrink-0`}>
        <h3 className={`font-medium ${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} flex items-center text-blue-800 min-w-0`}>
          <Book className={`${isExtremelyNarrow ? 'h-3 w-3 mr-1' : isVeryNarrow ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'} text-blue-600 flex-shrink-0`} />
          {!isExtremelyNarrow && <span className="truncate">発表者メモ</span>}
        </h3>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <Clock className={`${isExtremelyNarrow ? 'h-2 w-2' : isVeryNarrow ? 'h-2 w-2' : 'h-3 w-3'} text-blue-600`} />
          <span className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-xs'} text-blue-600 whitespace-nowrap`}>
            {isExtremelyNarrow ? `${currentSlide}/${totalSlides}` : isVeryNarrow ? `${currentSlide}/${totalSlides}` : `現在: ${currentSlide}/${totalSlides}`}
          </span>
        </div>
      </div>
      
      <ScrollArea className="flex-grow min-h-0">
        <div className={`${isVeryNarrow ? 'p-1' : isNarrow ? 'p-2' : 'p-4'} flex flex-col h-full min-w-0`} style={{ minHeight: 'fit-content' }}>
          {/* Current slide notes */}
          <div className={isVeryNarrow ? 'mb-2' : isNarrow ? 'mb-3' : 'mb-6'}>
            <div className={`p-1 rounded-t-lg border border-b-0 border-blue-200 bg-blue-50 flex items-center ${isNarrow ? 'justify-center' : 'justify-between'} min-w-0`}>
              <p className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} font-medium text-blue-800 truncate`}>
                {isExtremelyNarrow ? '現在' : isVeryNarrow ? '現在' : '現在のスライド'}
              </p>
              {!isNarrow && (
                <span className={`text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded-full flex-shrink-0`}>{currentSlide}</span>
              )}
            </div>
            
            <div className={`${isVeryNarrow ? 'p-1' : isNarrow ? 'p-2' : 'p-4'} rounded-b-lg border border-blue-200 bg-white min-w-0`}>
              {presenterNotes[currentSlide] ? (
                <p className={`${isExtremelyNarrow ? 'text-xs leading-tight' : isVeryNarrow ? 'text-xs' : 'text-sm'} leading-relaxed whitespace-pre-wrap break-words ${isShort ? 'line-clamp-3' : ''}`}>
                  {presenterNotes[currentSlide]}
                </p>
              ) : (
                <p className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} text-gray-500 italic`}>
                  {isExtremelyNarrow ? 'なし' : isVeryNarrow ? 'メモなし' : 'このスライドにはメモがありません'}
                </p>
              )}
            </div>
          </div>
          
          {/* Navigation hints - hide on very narrow or short panels */}
          {!isVeryNarrow && !isShort && (
            <div className={`grid grid-cols-1 gap-2 ${isVeryNarrow ? 'mb-2' : 'mb-4'}`}>
              <div className="flex justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  <ChevronUp className="h-3 w-3 mr-1" /> {isNarrow ? '前(←)' : '前のスライド (←)'}
                </span>
                <span className="flex items-center">
                  {isNarrow ? '次(→)' : '次のスライド (→)'} <ChevronDown className="h-3 w-3 ml-1" />
                </span>
              </div>
            </div>
          )}
          
          {/* Next slide preview - hide on short panels */}
          {currentSlide < totalSlides && !isShort && (
            <div className={isVeryNarrow ? 'mb-2' : 'mb-4'}>
              <div className={`p-1 rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 flex items-center ${isNarrow ? 'justify-center' : 'justify-between'} min-w-0`}>
                <p className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} font-medium text-gray-700 truncate`}>
                  {isExtremelyNarrow ? '次' : isVeryNarrow ? '次' : '次のスライド'}
                </p>
                {!isNarrow && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-1 py-0.5 rounded-full flex-shrink-0">{currentSlide + 1}</span>
                )}
              </div>
              
              <div className={`${isVeryNarrow ? 'p-1' : isNarrow ? 'p-2' : 'p-4'} rounded-b-lg border border-gray-200 bg-white min-w-0`}>
                {presenterNotes[currentSlide + 1] ? (
                  <p className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} text-gray-600 whitespace-pre-wrap line-clamp-2 break-words`}>
                    {presenterNotes[currentSlide + 1]}
                  </p>
                ) : (
                  <p className={`${isExtremelyNarrow ? 'text-xs' : isVeryNarrow ? 'text-xs' : 'text-sm'} text-gray-500 italic`}>
                    {isExtremelyNarrow ? 'なし' : isVeryNarrow ? 'メモなし' : '次のスライドにはメモがありません'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Previous slide reference - hide on very narrow or short panels */}
          {currentSlide > 1 && !isVeryNarrow && !isShort && (
            <div className="mt-2">
              <div className={`p-1 rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 flex items-center ${isNarrow ? 'justify-center' : 'justify-between'} min-w-0`}>
                <p className="text-sm font-medium text-gray-700 truncate">前のスライド</p>
                {!isNarrow && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-1 py-0.5 rounded-full flex-shrink-0">{currentSlide - 1}</span>
                )}
              </div>
              
              <div className="p-2 rounded-b-lg border border-gray-200 bg-white min-w-0">
                {presenterNotes[currentSlide - 1] ? (
                  <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-1 break-words">
                    {presenterNotes[currentSlide - 1]}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">前のスライドにはメモがありません</p>
                )}
              </div>
            </div>
          )}
          
          {/* Speaker tips - hide on narrow or short panels */}
          {!isNarrow && !isShort && (
            <div className="mt-auto pt-4 border-t border-gray-100">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">プレゼンテーションのヒント</h4>
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
