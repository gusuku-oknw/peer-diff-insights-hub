
/**
 * スライドサムネイル共通型定義
 */

// スライドデータの基本構造
export interface BaseSlideData {
  id: number;
  title: string;
  thumbnail?: string;
  elements?: any[];
  hasComments: boolean;
  isReviewed: boolean;
}

// ユーザータイプ
export type UserType = "student" | "enterprise";

// サムネイル表示の基本プロパティ
export interface BaseThumbnailProps {
  currentSlide: number;
  onSlideClick: (slideIndex: number) => void;
  onOpenOverallReview: () => void;
  containerWidth: number;
  userType?: UserType;
}

// レスポンシブ対応のための画面サイズ情報
export interface ResponsiveInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}
