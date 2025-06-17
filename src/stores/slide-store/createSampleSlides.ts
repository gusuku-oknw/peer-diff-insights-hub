import { Slide } from '@/types/slide.types';
import { createBasicSampleSlides } from './sampleSlides.basic';

// サンプルスライドを作成する関数（軽量版）
export const createSampleSlides = (): Slide[] => {
  // 基本的なサンプルスライドのみ使用
  return createBasicSampleSlides();
};

// 詳細版のサンプルスライドは動的インポートで提供
export const loadDetailedSampleSlides = async (): Promise<Slide[]> => {
  const { createDetailedSampleSlides } = await import('./sampleSlides.detailed');
  return createDetailedSampleSlides();
};

// 従来の大きなサンプルデータ（削除予定）
export const createLegacySampleSlides = (): Slide[] => {
  // 従来の大きなデータは削除し、基本データを返す
  return createBasicSampleSlides();
};