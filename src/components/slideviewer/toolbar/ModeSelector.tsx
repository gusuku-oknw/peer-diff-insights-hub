
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Presentation, Pencil, MessageCircle } from "lucide-react";
import { ViewerMode } from "@/stores/slideStore";

interface ModeSelectorProps {
  currentMode: ViewerMode;
  onModeChange: (mode: ViewerMode) => void;
}

const ModeSelector = ({ currentMode, onModeChange }: ModeSelectorProps) => {
  return (
    <Tabs 
      defaultValue={currentMode} 
      value={currentMode} 
      className="w-auto" 
      onValueChange={value => onModeChange(value as ViewerMode)}
    >
      <TabsList className="bg-slate-100 p-0.5 sm:p-1">
        <TabsTrigger value="presentation" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white px-2 sm:px-3 py-1">
          <Presentation className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
          <span className="hidden sm:inline">プレゼンテーション</span>
        </TabsTrigger>
        
        <TabsTrigger value="edit" className="data-[state=active]:bg-green-500 data-[state=active]:text-white px-2 sm:px-3 py-1">
          <Pencil className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
          <span className="hidden sm:inline">編集</span>
        </TabsTrigger>
        
        <TabsTrigger value="review" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white px-2 sm:px-3 py-1">
          <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
          <span className="hidden sm:inline">レビュー</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ModeSelector;
