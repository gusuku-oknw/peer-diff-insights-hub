
import type { ViewerMode } from "../common.types";

// Base panel properties
export interface BasePanelProps {
  currentSlide: number;
  totalSlides: number;
  panelWidth?: number;
  panelHeight?: number;
  isNarrow?: boolean;
  isVeryNarrow?: boolean;
}

// Notes panel specific props
export interface NotesPanelProps extends BasePanelProps {
  presenterNotes: Record<number, string>;
}

// Review panel specific props
export interface ReviewPanelProps extends BasePanelProps {
  presenterNotes?: Record<number, string>;
}

// Side panel props
export interface SidePanelProps extends BasePanelProps {
  shouldShowNotes: boolean;
  shouldShowReviewPanel: boolean;
  presenterNotes: Record<number, string>;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

// Panel visibility state
export interface PanelVisibility {
  leftSidebar: boolean;
  rightSidebar: boolean;
  presenterNotes: boolean;
  reviewPanel: boolean;
  rightPanelCollapsed?: boolean;
}

// Panel layout configuration
export interface PanelLayoutConfig {
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  rightPanelCollapsed: boolean;
  mobileSheetMode: boolean;
}

// Panel responsive states
export interface PanelResponsiveState {
  panelWidth: number;
  panelHeight: number;
  isNarrow: boolean;
  isVeryNarrow: boolean;
  breakpoints: {
    narrow: number;
    veryNarrow: number;
  };
}
