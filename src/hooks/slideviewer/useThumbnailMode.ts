
import { useMemo } from 'react';
import { useResponsiveThumbnails } from './useResponsiveThumbnails';
import { useResponsiveLayout } from './useResponsiveLayout';

interface UseThumbnailModeProps {
  containerWidth: number;
  showAsPopup?: boolean;
}

export const useThumbnailMode = ({ 
  containerWidth, 
  showAsPopup = false 
}: UseThumbnailModeProps) => {
  const { mobile } = useResponsiveLayout();
  const { shouldUsePopup, optimalHeight } = useResponsiveThumbnails({
    containerWidth,
    isPopupMode: false
  });

  // ポップアップモード判定ロジックを一箇所に集約
  const usePopupMode = useMemo(() => {
    return showAsPopup || shouldUsePopup || (mobile && containerWidth < 480);
  }, [showAsPopup, shouldUsePopup, mobile, containerWidth]);

  // 最適な高さ計算
  const enhancedHeight = useMemo(() => {
    return Math.max(optimalHeight, mobile ? 160 : 200);
  }, [optimalHeight, mobile]);

  return {
    usePopupMode,
    enhancedHeight,
    shouldUsePopup,
    optimalHeight
  };
};
