
import type { ViewerMode } from "@/stores/slideStore";

// Base panel properties
export interface BasePanelProps {
  currentSlide: number;
  totalSlides: number;
}

// Notes panel specific props
export interface NotesPanelProps extends BasePanelProps {
  presenterNotes: Record<number, string>;
}

// Review panel specific props
export interface ReviewPanelProps extends BasePanelProps {
  // Additional review-specific props can be added here
}

// Side panel props
export interface SidePanelProps extends BasePanelProps {
  shouldShowNotes: boolean;
  shouldShowReviewPanel: boolean;
  presenterNotes: Record<number, string>;
}

// Panel visibility state
export interface PanelVisibility {
  leftSidebar: boolean;
  rightSidebar: boolean;
  presenterNotes: boolean;
  reviewPanel: boolean;
}
