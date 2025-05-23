
import { Book, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";

interface NotesPanelProps {
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
}

const NotesPanel = ({ currentSlide, totalSlides, presenterNotes }: NotesPanelProps) => {
  const { userProfile } = useAuth();
  
  return (
    <div className="h-full bg-white shadow-sm flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 bg-blue-50 flex items-center justify-between">
        <h3 className="font-medium text-sm flex items-center text-blue-800">
          <Book className="h-4 w-4 mr-2 text-blue-600" />
          発表者メモ
        </h3>
        <div className="flex items-center space-x-2">
          <Clock className="h-3 w-3 text-blue-600" />
          <span className="text-xs text-blue-600">現在のスライド: {currentSlide}/{totalSlides}</span>
        </div>
      </div>
      
      <ScrollArea className="flex-grow">
        <div className="p-4 flex flex-col h-full">
          {/* Current slide notes */}
          <div className="mb-6">
            <div className="p-2 rounded-t-lg border border-b-0 border-blue-200 bg-blue-50 flex items-center justify-between">
              <p className="text-sm font-medium text-blue-800">現在のスライド</p>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{currentSlide}</span>
            </div>
            
            <div className="p-4 rounded-b-lg border border-blue-200 bg-white">
              {presenterNotes[currentSlide] ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{presenterNotes[currentSlide]}</p>
              ) : (
                <p className="text-sm text-gray-500 italic">このスライドにはメモがありません</p>
              )}
            </div>
          </div>
          
          {/* Navigation hints */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="flex justify-between text-xs text-gray-500">
              <span className="flex items-center">
                <ChevronUp className="h-3 w-3 mr-1" /> 前のスライド (←)
              </span>
              <span className="flex items-center">
                次のスライド (→) <ChevronDown className="h-3 w-3 ml-1" />
              </span>
            </div>
          </div>
          
          {/* Next slide preview */}
          {currentSlide < totalSlides && (
            <div>
              <div className="p-2 rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">次のスライド</p>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{currentSlide + 1}</span>
              </div>
              
              <div className="p-4 rounded-b-lg border border-gray-200 bg-white">
                {presenterNotes[currentSlide + 1] ? (
                  <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-3">
                    {presenterNotes[currentSlide + 1]}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">次のスライドにはメモがありません</p>
                )}
              </div>
            </div>
          )}

          {/* Previous slide reference */}
          {currentSlide > 1 && (
            <div className="mt-4">
              <div className="p-2 rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">前のスライド</p>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{currentSlide - 1}</span>
              </div>
              
              <div className="p-4 rounded-b-lg border border-gray-200 bg-white">
                {presenterNotes[currentSlide - 1] ? (
                  <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-1">
                    {presenterNotes[currentSlide - 1]}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">前のスライドにはメモがありません</p>
                )}
              </div>
            </div>
          )}
          
          {/* Speaker tips */}
          <div className="mt-auto pt-6 border-t border-gray-100">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">プレゼンテーションのヒント</h4>
            <ul className="text-xs text-gray-600 space-y-2">
              <li>• 聴衆の方を見て話すようにしましょう</li>
              <li>• スライドを読み上げるのではなく、説明するよう心がけましょう</li>
              <li>• 質問がある場合は、スライドの最後に受け付けることを伝えましょう</li>
            </ul>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotesPanel;
