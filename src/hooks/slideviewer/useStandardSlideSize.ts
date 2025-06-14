
import { useState, useEffect, useMemo } from 'react';
import { getOptimalSlideSize, getBestFitSlideSize, calculateZoomToFit, SlideSize, SLIDE_ASPECT_RATIOS } from '@/utils/slideCanvas/standardSlideSizes';

interface UseStandardSlideSizeProps {
  containerWidth?: number;
  containerHeight?: number;
  preferredAspectRatio?: number;
  forceSize?: SlideSize;
}

export const useStandardSlideSize = ({
  containerWidth = 0,
  containerHeight = 0,
  preferredAspectRatio = SLIDE_ASPECT_RATIOS.widescreen,
  forceSize
}: UseStandardSlideSizeProps = {}) => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // デバイスタイプの判定
  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  // 標準スライドサイズの決定
  const slideSize = useMemo((): SlideSize => {
    // 強制指定がある場合はそれを使用
    if (forceSize) {
      return forceSize;
    }

    // コンテナサイズが指定されている場合は最適サイズを計算
    if (containerWidth > 0 && containerHeight > 0) {
      return getBestFitSlideSize(containerWidth, containerHeight, preferredAspectRatio);
    }

    // デフォルトはデバイスタイプベース
    return getOptimalSlideSize(deviceType);
  }, [containerWidth, containerHeight, preferredAspectRatio, deviceType, forceSize]);

  // フィット用の推奨ズーム率
  const recommendedZoom = useMemo(() => {
    if (containerWidth > 0 && containerHeight > 0) {
      return calculateZoomToFit(slideSize, containerWidth, containerHeight);
    }
    return 100;
  }, [slideSize, containerWidth, containerHeight]);

  // スケール情報
  const scaleInfo = useMemo(() => {
    const baseWidth = 1600; // 基準サイズ
    const baseHeight = 900;
    
    return {
      scaleX: slideSize.width / baseWidth,
      scaleY: slideSize.height / baseHeight,
      scale: Math.min(slideSize.width / baseWidth, slideSize.height / baseHeight)
    };
  }, [slideSize]);

  return {
    slideSize,
    deviceType,
    recommendedZoom,
    scaleInfo,
    isFixedSize: true, // 常に固定サイズであることを示す
    aspectRatio: slideSize.aspectRatio
  };
};
