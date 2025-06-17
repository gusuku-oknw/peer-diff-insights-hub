
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
