
export interface SlideData {
  id: number;
  title?: string;
  thumbnail?: string;
  elements?: any[];
  hasComments?: boolean;
  isReviewed?: boolean;
}

export interface ThumbnailCardProps {
  slide: SlideData;
  slideIndex: number;
  isActive: boolean;
  thumbnailWidth: number;
  onClick: (slideIndex: number) => void;
  userType?: "student" | "enterprise";
  showHoverActions?: boolean;
}

export interface ThumbnailSizeInfo {
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
}
