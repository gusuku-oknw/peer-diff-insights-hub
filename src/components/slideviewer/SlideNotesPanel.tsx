
import { Book } from "lucide-react";

interface SlideNotesPanelProps {
  currentSlide: number;
  totalSlides: number;
  presenterNotes: Record<number, string>;
}

const SlideNotesPanel = ({ currentSlide, totalSlides, presenterNotes }: SlideNotesPanelProps) => {
  return (
    <div className="h-full bg-white shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
        <h3 className="font-medium text-sm flex items-center text-blue-800">
          <Book className="h-4 w-4 mr-2 text-blue-600" />
          発表者メモ
        </h3>
      </div>
      <div className="p-4">
        <div className="p-3 rounded-lg border border-blue-100 bg-blue-50 mb-4">
          <p className="text-sm font-medium text-blue-900">スライド {currentSlide}</p>
        </div>
        
        <p className="text-sm leading-relaxed">
          {presenterNotes[currentSlide] || "このスライドにはメモがありません"}
        </p>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">次のスライド:</h4>
          {currentSlide < totalSlides ? (
            <>
              <p className="text-xs text-gray-500 mb-2">スライド {currentSlide + 1}</p>
              <p className="text-xs text-gray-600 italic">
                {presenterNotes[currentSlide + 1]?.substring(0, 100)}...
              </p>
            </>
          ) : (
            <p className="text-xs text-gray-500">最終スライドです</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlideNotesPanel;
