
import React from 'react';
import { Pencil, MessageCircle, PlayCircle } from "lucide-react"; 
import { DSButton } from '@/design-system/components/Button';
import { useDesignSystem } from '@/design-system/components/DesignSystemProvider';
import { cn } from '@/lib/utils';

// Define the ViewerMode type locally to ensure it includes all modes
type ViewerMode = "presentation" | "edit" | "review";

interface ModeSelectorProps {
  currentMode: ViewerMode;
  onModeChange: (mode: ViewerMode) => void;
  userType: "student" | "enterprise";
}

const ModeSelector = ({ currentMode, onModeChange, userType }: ModeSelectorProps) => {
  const { setMode, currentMode: dsMode } = useDesignSystem();

  // Update design system mode when viewer mode changes
  React.useEffect(() => {
    setMode(currentMode);
  }, [currentMode, setMode]);

  if (userType === "student") {
    // Student view: Display static "Review Mode" indicator
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-sm font-medium h-10 transition-all duration-200">
        <MessageCircle className="h-4 w-4" />
        <span className="font-semibold">レビューモード</span>
      </div>
    );
  }

  // Enterprise view: Render button group for mode selection
  const modes = [
    {
      value: "presentation" as ViewerMode,
      label: "発表",
      icon: PlayCircle,
      color: "blue"
    },
    {
      value: "edit" as ViewerMode,
      label: "編集", 
      icon: Pencil,
      color: "green"
    },
    {
      value: "review" as ViewerMode,
      label: "レビュー",
      icon: MessageCircle,
      color: "purple"
    }
  ];

  return (
    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1 shadow-sm">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.value;
        
        return (
          <DSButton
            key={mode.value}
            variant={isActive ? "primary" : "ghost"}
            size="sm"
            onClick={() => onModeChange(mode.value)}
            icon={<Icon />}
            iconPosition="left"
            className={cn(
              "transition-all duration-200 min-w-[80px] sm:min-w-[100px]",
              isActive && mode.color === "blue" && "bg-blue-600 text-white shadow-sm",
              isActive && mode.color === "green" && "bg-green-600 text-white shadow-sm", 
              isActive && mode.color === "purple" && "bg-purple-600 text-white shadow-sm",
              !isActive && "text-gray-700 hover:text-gray-900 hover:bg-white"
            )}
          >
            <span className="hidden sm:inline font-medium">{mode.label}</span>
          </DSButton>
        );
      })}
    </div>
  );
};

export default ModeSelector;
