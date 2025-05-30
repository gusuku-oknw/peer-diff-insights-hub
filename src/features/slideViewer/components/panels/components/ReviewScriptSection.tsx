
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

interface ReviewScriptSectionProps {
  currentScript: string;
  isVeryNarrow?: boolean;
}

const ReviewScriptSection: React.FC<ReviewScriptSectionProps> = ({
  currentScript,
  isVeryNarrow = false
}) => {
  if (!currentScript) return null;

  return (
    <div className={`${isVeryNarrow ? 'p-1' : 'p-3'} border-b border-gray-100 bg-gray-50 flex-shrink-0`}>
      <div className="flex items-center gap-2 mb-2">
        <FileText className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} text-gray-600`} />
        <span className={`${isVeryNarrow ? 'text-xs' : 'text-sm'} font-medium text-gray-700`}>
          発表原稿
        </span>
      </div>
      <ScrollArea className={`${isVeryNarrow ? 'h-16' : 'h-20'}`}>
        <p className={`${isVeryNarrow ? 'text-xs' : 'text-sm'} text-gray-600 break-words`}>
          {currentScript}
        </p>
      </ScrollArea>
    </div>
  );
};

export default ReviewScriptSection;
