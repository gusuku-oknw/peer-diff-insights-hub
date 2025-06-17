
// Unified slide types - consolidating from multiple locations
export type SlideElementType = 'text' | 'image' | 'shape' | 'rectangle' | 'circle' | 'chart';

export interface SlideElement {
  id: string;
  type: SlideElementType;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  angle?: number;
  zIndex?: number;
  props: Record<string, any>;
}

export interface SlideComment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  resolved?: boolean;
}

export type SlideStatus = 'draft' | 'review' | 'approved' | 'archived';

export interface Slide {
  id: number;
  title?: string;
  content?: string;
  html?: string; // Add HTML property for rich content
  notes: string;
  elements: SlideElement[];
  thumbnail?: string;
  createdAt?: string;
  updatedAt?: string;
  // New properties for enhanced UI/UX
  comments?: SlideComment[];
  isReviewed?: boolean;
  status?: SlideStatus;
  progress?: number;
  isImportant?: boolean;
  tags?: string[];
  lastEditedBy?: string;
}

export type ViewerMode = "presentation" | "edit" | "review";

export interface SlideNavigationState {
  currentSlide: number;
  totalSlides: number;
  history: number[];
}

// Enhanced slide data for UI components
export interface EnhancedSlideData {
  id: number;
  title: string;
  thumbnail?: string;
  elements: SlideElement[];
  hasComments: boolean;
  commentCount: number;
  isReviewed: boolean;
  status: SlideStatus;
  progress: number;
  isImportant: boolean;
  lastUpdated: string;
  isActive?: boolean;
}

// Thumbnail display options
export type ThumbnailSize = 'compact' | 'normal' | 'large';
export type ThumbnailFilter = 'all' | 'reviewed' | 'unreviewed' | 'commented' | 'important';
export type ThumbnailSort = 'created' | 'updated' | 'title' | 'progress' | 'status';

export interface ThumbnailDisplayOptions {
  size: ThumbnailSize;
  filter: ThumbnailFilter;
  sort: ThumbnailSort;
  sortOrder: 'asc' | 'desc';
  showSearch: boolean;
  searchQuery: string;
}
