
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit3, ChevronDown, ChevronUp } from "lucide-react";

interface ReviewScriptSectionProps {
  currentScript: string;
  isVeryNarrow?: boolean;
}

const ReviewScriptSection: React.FC<ReviewScriptSectionProps> = ({
  currentScript,
  isVeryNarrow = false
}) => {
  const [isScriptExpanded, setIsScriptExpanded] = useState(false);

  if (!currentScript) return null;

  return (
    <div className={`${isVeryNarrow ? 'p-1' : 'p-3'} border-b border-gray-100 bg-green-50 flex-shrink-0`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsScriptExpanded(!isScriptExpanded)}
        className="w-full justify-between p-2 h-auto hover:bg-green-100"
      >
        <div className="flex items-center gap-2">
          <Edit3 className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} text-green-600`} />
          <span className={`${isVeryNarrow ? 'text-xs' : 'text-sm'} font-medium text-green-800`}>
            {isVeryNarrow ? '台本' : 'このスライドの台本'}
          </span>
        </div>
        {isScriptExpanded ? (
          <ChevronUp className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} text-green-600`} />
        ) : (
          <ChevronDown className={`${isVeryNarrow ? 'h-3 w-3' : 'h-4 w-4'} text-green-600`} />
        )}
      </Button>
      
      {isScriptExpanded && (
        <div className={`${isVeryNarrow ? 'mt-1 p-1' : 'mt-2 p-3'} bg-white rounded border border-green-200`}>
          <p className={`${isVeryNarrow ? 'text-xs' : 'text-sm'} text-gray-800 leading-relaxed whitespace-pre-wrap`}>
            {currentScript}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewScriptSection;
