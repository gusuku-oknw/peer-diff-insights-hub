
import React from "react";
import { Button } from "@/components/ui/button";
import { History, MessageSquare, X } from "lucide-react";

interface FloatingToggleButtonProps {
  onToggleLeft: () => void;
  onToggleRight: () => void;
  leftOpen: boolean;
  rightOpen: boolean;
}

const FloatingToggleButton: React.FC<FloatingToggleButtonProps> = ({
  onToggleLeft,
  onToggleRight,
  leftOpen,
  rightOpen
}) => {
  return (
    <div className="fixed bottom-4 left-4 z-40 flex gap-2">
      <Button
        onClick={onToggleLeft}
        variant="outline"
        size="sm"
        className="bg-white shadow-lg border-gray-300"
      >
        {leftOpen ? <X className="h-4 w-4" /> : <History className="h-4 w-4" />}
      </Button>
      
      <Button
        onClick={onToggleRight}
        variant="outline"
        size="sm"
        className="bg-white shadow-lg border-gray-300"
      >
        {rightOpen ? <X className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default FloatingToggleButton;
