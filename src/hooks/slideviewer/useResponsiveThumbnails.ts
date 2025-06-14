
import { useMemo } from 'react';
import { useResponsiveLayout } from './useResponsiveLayout';

interface UseResponsiveThumbnailsProps {
  containerWidth: number;
  isPopupMode?: boolean;
}

export const useResponsiveThumbnails = ({ 
  containerWidth, 
  isPopupMode = false 
}: UseResponsiveThumbnailsProps) => {
  const { isMobile, isTablet, isDesktop } = useResponsiveLayout();

  // 統一されたサムネイルサイズ計算
  const calculateThumbnailSize = useMemo(() => {
    if (isPopupMode) {
      if (isMobile) {
        // モバイルポップアップ：画面幅の35%、160-200px範囲
        return Math.max(160, Math.min(200, containerWidth * 0.35));
      } else if (isTablet) {
        // タブレットポップアップ：画面幅の25%、200-250px範囲
        return Math.max(200, Math.min(250, containerWidth * 0.25));
      } else {
        // デスクトップポップアップ：画面幅の20%、220-280px範囲
        return Math.max(220, Math.min(280, containerWidth * 0.2));
      }
    } else {
      if (isMobile) {
        // モバイル固定：140-180px
        return Math.max(140, Math.min(180, containerWidth * 0.4));
      } else if (isTablet) {
        // タブレット固定：180-220px
        return Math.max(180, Math.min(220, containerWidth * 0.22));
      } else {
        // デスクトップ固定：200-300px
        return Math.max(200, Math.min(300, containerWidth * 0.22));
      }
    }
  }, [containerWidth, isPopupMode, isMobile, isTablet, isDesktop]);

  // 統一されたギャップ計算
  const gap = useMemo(() => {
    if (isMobile) return 12;
    if (isTablet) return 16;
    return 20;
  }, [isMobile, isTablet]);

  // レスポンシブモード判定
  const shouldUsePopup = useMemo(() => {
    return isMobile || (isTablet && containerWidth < 900);
  }, [isMobile, isTablet, containerWidth]);

  // 適切な高さ計算
  const optimalHeight = useMemo(() => {
    if (isMobile) return 140;
    if (isTablet) return 180;
    return 220;
  }, [isMobile, isTablet]);

  return {
    thumbnailWidth: calculateThumbnailSize,
    gap,
    shouldUsePopup,
    optimalHeight,
    isMobile,
    isTablet,
    isDesktop
  };
};
