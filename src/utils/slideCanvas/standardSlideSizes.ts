
/**
 * 標準スライドサイズ定義
 * PowerPointや一般的なプレゼンテーションソフトウェアと互換性のあるサイズ
 */

export const SLIDE_ASPECT_RATIOS = {
  widescreen: 16 / 9,  // 16:9 (現代標準)
  standard: 4 / 3,     // 4:3 (クラシック)
} as const;

export const STANDARD_SLIDE_SIZES = {
  // 16:9 アスペクト比
  'fullhd': { width: 1920, height: 1080, aspectRatio: SLIDE_ASPECT_RATIOS.widescreen, name: 'Full HD' },
  'hd': { width: 1280, height: 720, aspectRatio: SLIDE_ASPECT_RATIOS.widescreen, name: 'HD' },
  'large': { width: 1600, height: 900, aspectRatio: SLIDE_ASPECT_RATIOS.widescreen, name: 'Large' },
  'medium': { width: 960, height: 540, aspectRatio: SLIDE_ASPECT_RATIOS.widescreen, name: 'Medium' },
  'small': { width: 640, height: 360, aspectRatio: SLIDE_ASPECT_RATIOS.widescreen, name: 'Small' },
  
  // 4:3 アスペクト比 (クラシック)
  'standard_large': { width: 1024, height: 768, aspectRatio: SLIDE_ASPECT_RATIOS.standard, name: 'Standard Large' },
  'standard_medium': { width: 800, height: 600, aspectRatio: SLIDE_ASPECT_RATIOS.standard, name: 'Standard Medium' },
  'standard_small': { width: 640, height: 480, aspectRatio: SLIDE_ASPECT_RATIOS.standard, name: 'Standard Small' },
} as const;

export type SlideSizeKey = keyof typeof STANDARD_SLIDE_SIZES;

export interface SlideSize {
  width: number;
  height: number;
  aspectRatio: number;
  name: string;
}

/**
 * デバイスタイプに基づいて最適なスライドサイズを取得
 */
export const getOptimalSlideSize = (deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'): SlideSize => {
  switch (deviceType) {
    case 'mobile':
      return STANDARD_SLIDE_SIZES.small;
    case 'tablet':
      return STANDARD_SLIDE_SIZES.medium;
    case 'desktop':
    default:
      return STANDARD_SLIDE_SIZES.large;
  }
};

/**
 * コンテナサイズに基づいて最適なスライドサイズを選択
 * ただし、固定サイズを維持しつつ、表示可能な最大サイズを選択
 */
export const getBestFitSlideSize = (
  containerWidth: number, 
  containerHeight: number,
  preferredAspectRatio: number = SLIDE_ASPECT_RATIOS.widescreen
): SlideSize => {
  const availableSizes = Object.values(STANDARD_SLIDE_SIZES)
    .filter(size => Math.abs(size.aspectRatio - preferredAspectRatio) < 0.1)
    .sort((a, b) => b.width - a.width); // 大きいサイズから順に

  // コンテナに収まる最大サイズを探す
  for (const size of availableSizes) {
    if (size.width <= containerWidth * 0.9 && size.height <= containerHeight * 0.9) {
      return size;
    }
  }

  // どれも収まらない場合は最小サイズを返す
  return preferredAspectRatio === SLIDE_ASPECT_RATIOS.widescreen 
    ? STANDARD_SLIDE_SIZES.small 
    : STANDARD_SLIDE_SIZES.standard_small;
};

/**
 * ズーム計算用のヘルパー関数
 */
export const calculateZoomToFit = (
  slideSize: SlideSize,
  containerWidth: number,
  containerHeight: number,
  padding: number = 40
): number => {
  const availableWidth = containerWidth - padding;
  const availableHeight = containerHeight - padding;
  
  const scaleX = availableWidth / slideSize.width;
  const scaleY = availableHeight / slideSize.height;
  
  const scale = Math.min(scaleX, scaleY, 1); // 100%を超えないように制限
  
  return Math.round(scale * 100);
};
