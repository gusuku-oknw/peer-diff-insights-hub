import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, MessageCircle, PlayCircle } from "lucide-react"; // Added PlayCircle

// Define the ViewerMode type locally to ensure it includes all modes
type ViewerMode = "presentation" | "edit" | "review";

interface ModeSelectorProps {
  currentMode: ViewerMode;
  onModeChange: (mode: ViewerMode) => void;
  userType: "student" | "enterprise";
}

const ModeSelector = ({ currentMode, onModeChange, userType }: ModeSelectorProps) => {
  if (userType === "student") {
    // Student view: Display static "Review Mode" indicator
    // (Assuming students are always forced into "review" mode by SlideViewer.tsx logic)
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-md text-sm font-medium h-[calc(theme(height.10)-2px)]"> {/* Adjusted height */}
        <MessageCircle className="h-4 w-4" />
        <span>レビューモード</span>
      </div>
    );
  }

  // Enterprise view: Render Tabs for mode selection
  const availableModes: ViewerMode[] = ["presentation", "edit", "review"]; // Explicitly set for enterprise

  const handleValueChange = (value: string) => {
    // Ensure the value is a valid ViewerMode before calling onModeChange
    if (availableModes.includes(value as ViewerMode)) {
      onModeChange(value as ViewerMode);
    }
  };

  return (
    <Tabs 
      defaultValue={currentMode} 
      value={currentMode} 
      className="w-auto" 
      onValueChange={handleValueChange}
    >
      <TabsList className="bg-slate-100 p-0.5 sm:p-1">
        {/* Presentation Tab (for enterprise) */}
        {availableModes.includes("presentation") && (
          <TabsTrigger value="presentation" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white px-2 sm:px-3 py-1">
            <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">発表</span>
          </TabsTrigger>
        )}

        {/* Edit Tab (for enterprise) */}
        {availableModes.includes("edit") && (
          <TabsTrigger value="edit" className="data-[state=active]:bg-green-500 data-[state=active]:text-white px-2 sm:px-3 py-1">
            <Pencil className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">編集</span>
          </TabsTrigger>
        )}
        
        {/* Review Tab (for enterprise) */}
        {availableModes.includes("review") && (
          <TabsTrigger value="review" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white px-2 sm:px-3 py-1">
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">レビュー</span>
          </TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  );
};

export default ModeSelector;
