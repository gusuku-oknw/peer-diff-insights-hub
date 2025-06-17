/**
 * 標準スライドサイズ定義
 * PowerPointや一般的なプレゼンテーションソフトウェアと互換性のあるサイズ
 */

export const SLIDE_ASPECT_RATIOS = {
  widescreen: 16 / 9,  // 16:9 (現代標準)
  standard: 4 / 3,     // 4:3 (クラシック)
  ultrawide: 21 / 9,   // 21:9 (ウルトラワイド)
} as const;

export const STANDARD_SLIDE_SIZES = {
  // 超高解像度 - 8K/4K対応
  'ultra_8k': { width: 7680, height: 4320, aspectRatio: SLIDE_ASPECT_RATIOS.widescreen, name: '8K Ultra HD' },
  'ultra_4k': { width: 3840, height: 2160, aspectRatio: SLIDE_ASPECT_RATIOS.widescreen, name: '4K Ultra HD' },
  'qhd': { width: 2560, height: 1440, aspectRatio: SLIDE_ASPECT_RATIOS.widescreen, name: 'QHD 2K' },
  'wqhd': { width: 3440, height: 1440, aspectRatio: SLIDE_ASPECT_RATIOS.ultrawide, name: 'WQHD Ultrawide' },
  
  // 16:9 アスペクト比 (既存 + 高解像度)
  'fullhd_plus': { width: 2560, height: 1440, aspectRatio: SLIDE_ASPECT_RATIOS.widescreen, name: 'Full HD+' },
  'fullhd': { width: 1920, height: 1080, aspectRatio: SLIDE_ASPECT_RATIOS.widescreen, name: 'Full HD' },
  'hd': { width: 1280, height: 720, aspectRatio: SLIDE_ASPECT_RATIOS.widescreen, name: 'HD' },
  'large': { width: 1600, height: 900, aspectRatio: SLIDE_ASPECT_RATIOS.widescreen, name: 'Large' },
  'medium': { width: 960, height: 540, aspectRatio: SLIDE_ASPECT_RATIOS.widescreen, name: 'Medium' },
  'small': { width: 640, height: 360, aspectRatio: SLIDE_ASPECT_RATIOS.widescreen, name: 'Small' },
  
  // 4:3 アスペクト比 (クラシック)
  'standard_ultra': { width: 2048, height: 1536, aspectRatio: SLIDE_ASPECT_RATIOS.standard, name: 'Standard Ultra' },
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
 * ディスプレイ解像度とピクセル密度を検出
 */
export const detectDisplayCapabilities = () => {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const pixelRatio = window.devicePixelRatio || 1;
  const physicalWidth = screenWidth * pixelRatio;
  const physicalHeight = screenHeight * pixelRatio;
  
  return {
    screenWidth,
    screenHeight,
    pixelRatio,
    physicalWidth,
    physicalHeight,
    isHighDPI: pixelRatio >= 2,
    isUltraHighDPI: pixelRatio >= 3,
    is4KCapable: physicalWidth >= 3840 || physicalHeight >= 2160,
    is8KCapable: physicalWidth >= 7680 || physicalHeight >= 4320
  };
};

/**
 * デバイスタイプに基づいて最適なスライドサイズを取得（高解像度対応）
 */
export const getOptimalSlideSize = (deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'): SlideSize => {
  const capabilities = detectDisplayCapabilities();
  
  switch (deviceType) {
    case 'mobile':
      return capabilities.isHighDPI ? STANDARD_SLIDE_SIZES.medium : STANDARD_SLIDE_SIZES.small;
    case 'tablet':
      return capabilities.isHighDPI ? STANDARD_SLIDE_SIZES.large : STANDARD_SLIDE_SIZES.medium;
    case 'desktop':
    default:
      // デスクトップでは利用可能な最高解像度を選択
      if (capabilities.is8KCapable) return STANDARD_SLIDE_SIZES.ultra_8k;
      if (capabilities.is4KCapable) return STANDARD_SLIDE_SIZES.ultra_4k;
      if (capabilities.isUltraHighDPI) return STANDARD_SLIDE_SIZES.qhd;
      if (capabilities.isHighDPI) return STANDARD_SLIDE_SIZES.fullhd_plus;
      return STANDARD_SLIDE_SIZES.fullhd;
  }
};

/**
 * コンテナサイズに基づいて最適なスライドサイズを選択（超高解像度対応）
 */
export const getBestFitSlideSize = (
  containerWidth: number, 
  containerHeight: number,
  preferredAspectRatio: number = SLIDE_ASPECT_RATIOS.widescreen
): SlideSize => {
  const capabilities = detectDisplayCapabilities();

  // もともとのavailableSizesを大きい順に＆aspectでフィルタ
  const availableSizes = Object.values(STANDARD_SLIDE_SIZES)
    .filter(size => Math.abs(size.aspectRatio - preferredAspectRatio) < 0.1)
    .sort((a, b) => b.width - a.width);

  // 高画質改善: 最低でもlarge(1600x900)以上, 可能ならfullhd
  const minWidth = 1600;
  const enhancedAvailableSizes = availableSizes.filter(sz => sz.width >= minWidth);

  // 高DPI優遇 (ただしforce)
  // サイズ制約を緩和(90%→70%)してより大きいサイズも採用しやすくする
  const fittingSize = (enhancedAvailableSizes.length > 0 ? enhancedAvailableSizes : availableSizes).find(size => {
    return size.width <= containerWidth * 0.7 && size.height <= containerHeight * 0.7;
  });
  // 最低でも large
  return fittingSize || STANDARD_SLIDE_SIZES.large;
};

/**
 * ズーム計算用のヘルパー関数（高解像度対応）
 */
export const calculateZoomToFit = (
  slideSize: SlideSize,
  containerWidth: number,
  containerHeight: number,
  padding: number = 40
): number => {
  const capabilities = detectDisplayCapabilities();
  const availableWidth = containerWidth - padding;
  const availableHeight = containerHeight - padding;
  
  // 高DPIディスプレイでは表示サイズを調整
  const displayWidth = slideSize.width / (capabilities.pixelRatio || 1);
  const displayHeight = slideSize.height / (capabilities.pixelRatio || 1);
  
  const scaleX = availableWidth / displayWidth;
  const scaleY = availableHeight / displayHeight;
  
  const scale = Math.min(scaleX, scaleY, 2); // 最大200%まで拡大を許可
  
  return Math.round(scale * 100);
};
