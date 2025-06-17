
export interface ThumbnailSizeInfo {
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
}

export interface ThumbnailCardProps {
  slide: {
    id: number;
    title?: string;
    thumbnail?: string;
    hasComments?: boolean;
    commentCount?: number;
    isReviewed?: boolean;
    progress?: number;
    isImportant?: boolean;
    lastUpdated?: string;
  };
  slideIndex: number;
  isActive: boolean;
  thumbnailWidth: number;
  onClick: (slideIndex: number) => void;
  userType: "student" | "enterprise";
  showHoverActions?: boolean;
}

export interface ThumbnailImageProps {
  thumbnail?: string;
  slideIndex: number;
  title?: string;
  isActive: boolean;
  sizeInfo?: ThumbnailSizeInfo;
}

export interface ThumbnailInfoProps {
  slide: {
    title?: string;
    hasComments?: boolean;
    isReviewed?: boolean;
  };
  slideIndex: number;
  isActive: boolean;
  sizeInfo: ThumbnailSizeInfo;
  userType: "student" | "enterprise";
}

export interface ThumbnailStatusProps {
  hasComments?: boolean;
  commentCount?: number;
  isReviewed?: boolean;
  progress?: number;
  isImportant?: boolean;
}
