
import type { ViewerMode } from "@/stores/slide";

// Toolbar base properties
export interface BaseToolbarProps {
  currentSlide: number;
  totalSlides: number;
}

// Main toolbar props
export interface MainToolbarProps extends BaseToolbarProps {
  zoom: number;
  viewerMode: ViewerMode;
  isFullScreen: boolean;
  leftSidebarOpen: boolean;
  showPresenterNotes: boolean;
  presentationStartTime: Date | null;
  displayCount: number;
  onPreviousSlide: () => void;
  onNextSlide: () => void;
  onZoomChange: (zoom: number) => void;
  onModeChange: (mode: ViewerMode) => void;
  onLeftSidebarToggle: () => void;
  onFullScreenToggle: () => void;
  onShowPresenterNotesToggle: () => void;
  onStartPresentation: () => void;
  onSaveChanges: () => void;
}

// Edit toolbar props
export interface EditToolbarProps extends BaseToolbarProps {
  toggleSidebar: () => void;
}

// Toolbar button configuration
export interface ToolbarButton {
  id: string;
  label: string;
  icon: React.ComponentType;
  action: () => void;
  disabled?: boolean;
  variant?: "default" | "outline" | "ghost";
}
