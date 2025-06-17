
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
}

export interface ThumbnailImageProps {
  thumbnail?: string;
  slideIndex: number;
  title?: string;
  isActive: boolean;
}

export interface ThumbnailInfoProps {
  slideIndex: number;
  title?: string;
  isActive: boolean;
}

export interface ThumbnailStatusProps {
  hasComments?: boolean;
  commentCount?: number;
  isReviewed?: boolean;
  progress?: number;
  isImportant?: boolean;
}
