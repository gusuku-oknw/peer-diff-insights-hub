
import { Slide, SlideElement, ViewerMode } from '@/utils/types/slide.types';

// スライドストアの状態とアクション定義
export interface SlideStore {
  slides: Slide[];
  currentSlide: number;
  zoom: number;
  viewerMode: ViewerMode;
  isFullScreen: boolean;
  leftSidebarOpen: boolean;
  showPresenterNotes: boolean;
  presentationStartTime: number | null; // Changed from Date to number | null
  displayCount: number;
  isPPTXImported: boolean;
  pptxFilename: string | null;
  
  // PPTX関連アクション
  setPPTXImported: (imported: boolean, filename?: string | null) => void;
  importSlidesFromPPTX: (slidesData: Slide[]) => void;
  
  // 基本操作アクション
  setCurrentSlide: (index: number) => void;
  previousSlide: () => void;
  nextSlide: () => void;
  setZoom: (zoom: number) => void;
  setViewerMode: (mode: ViewerMode) => void;
  toggleLeftSidebar: () => void;
  toggleFullScreen: () => void;
  togglePresenterNotes: () => void;
  startPresentation: () => void;
  endPresentation: () => void;
  
  // 要素操作アクション
  updateElement: (slideId: number, elementId: string, props: Partial<SlideElement>) => void;
  addElement: (slideId: number, element: SlideElement) => void;
  removeElement: (slideId: number, elementId: string) => void;
  
  // その他
  setDisplayCount: (count: number) => void;
  generateThumbnails: () => void;
  exportToPPTX: () => void;
}

// PPTXインポートスライスの型定義
export interface PPTXImportSlice {
  isPPTXImported: boolean;
  pptxFilename: string | null;
  setPPTXImported: (imported: boolean, filename?: string | null) => void;
  importSlidesFromPPTX: (slidesData: Slide[]) => void;
}
