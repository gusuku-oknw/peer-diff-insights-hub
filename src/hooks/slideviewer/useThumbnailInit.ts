import { useEffect } from 'react';
import { useSlideStore } from '@/stores/slide.store';

/**
 * スライドサムネイルの初期化フック
 * アプリケーション起動時にサムネイルを生成
 */
export const useThumbnailInit = () => {
  const { slides, thumbnails, generateThumbnails } = useSlideStore();

  useEffect(() => {
    // サムネイルが存在しないスライドがある場合に生成
    const missingThumbnails = slides.filter(slide => !thumbnails[slide.id]);
    
    if (missingThumbnails.length > 0) {
      console.log(`Generating thumbnails for ${missingThumbnails.length} slides`);
      generateThumbnails();
    }
  }, [slides, thumbnails, generateThumbnails]);

  return {
    isGenerating: slides.length > Object.keys(thumbnails).length,
    thumbnailCount: Object.keys(thumbnails).length,
    totalSlides: slides.length
  };
};