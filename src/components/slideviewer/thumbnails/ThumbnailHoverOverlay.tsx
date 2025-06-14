
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit3, MessageSquare, Play } from "lucide-react";

interface ThumbnailHoverOverlayProps {
  slideIndex: number;
  onEdit?: (slideIndex: number) => void;
  onComment?: (slideIndex: number) => void;
  onPreview?: (slideIndex: number) => void;
  userType?: "student" | "enterprise";
}

const ThumbnailHoverOverlay = ({
  slideIndex,
  onEdit,
  onComment,
  onPreview,
  userType = "enterprise"
}: ThumbnailHoverOverlayProps) => {
  const showEditButton = userType === "enterprise" && onEdit;
  
  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 rounded-lg">
      {onPreview && (
        <Button
          variant="secondary"
          size="sm"
          className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-gray-700 shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            onPreview(slideIndex);
          }}
          aria-label={`スライド${slideIndex}をプレビュー`}
        >
          <Play className="h-3 w-3" />
        </Button>
      )}
      
      {onComment && (
        <Button
          variant="secondary"
          size="sm"
          className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-gray-700 shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            onComment(slideIndex);
          }}
          aria-label={`スライド${slideIndex}にコメント`}
        >
          <MessageSquare className="h-3 w-3" />
        </Button>
      )}
      
      {showEditButton && (
        <Button
          variant="secondary"
          size="sm"
          className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-gray-700 shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(slideIndex);
          }}
          aria-label={`スライド${slideIndex}を編集`}
        >
          <Edit3 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default ThumbnailHoverOverlay;
