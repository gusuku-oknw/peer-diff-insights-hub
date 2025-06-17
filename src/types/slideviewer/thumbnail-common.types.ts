
export type UserType = "student" | "enterprise";

export interface BaseSlideData {
  id: number;
  title?: string;
  thumbnail?: string;
  hasComments?: boolean;
  commentCount?: number;
  isReviewed?: boolean;
  progress?: number;
  isImportant?: boolean;
  lastUpdated?: string;
}

export interface BaseThumbnailProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  containerWidth: number;
  userType?: UserType;
}

export interface ThumbnailCardProps {
  slide: BaseSlideData;
  slideIndex: number;
  isActive: boolean;
  thumbnailWidth: number;
  onClick: (slideIndex: number) => void;
  userType: UserType;
}
