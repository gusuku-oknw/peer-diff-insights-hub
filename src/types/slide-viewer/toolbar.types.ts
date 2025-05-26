
import type { ViewerMode } from "../common.types";

export interface ToolbarProps {
  currentSlide: number;
  totalSlides: number;
  zoom: number;
  viewerMode: ViewerMode;
  isFullScreen: boolean;
  onModeChange: (mode: ViewerMode) => void;
  onZoomChange: (zoom: number) => void;
}

export interface NavigationControlsProps {
  currentSlide: number;
  totalSlides: number;
  onPreviousSlide: () => void;
  onNextSlide: () => void;
}

export interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export interface ModeSelectorProps {
  currentMode: ViewerMode;
  onModeChange: (mode: ViewerMode) => void;
}

export interface MainLayoutProps {
  currentBranch: string;
  branches: string[];
  commitHistory: any[];
  currentSlide: number;
  totalSlides: number;
  zoom: number;
  viewerMode: ViewerMode;
  leftSidebarOpen: boolean;
  showPresenterNotes: boolean;
  isFullScreen: boolean;
  presentationStartTime: Date | null;
  presenterNotes: Record<number, string>;
  elapsedTime: number;
  displayCount: number;
  commentedSlides: number[];
  mockComments: any[];
  userType: "student" | "enterprise";
  onBranchChange: (branch: string) => void;
  onToggleLeftSidebar: () => void;
  onSlideChange: (slide: number) => void;
}
