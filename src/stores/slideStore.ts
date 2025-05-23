
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define our slide element types
export type SlideElement = {
  id: string;
  type: 'text' | 'image' | 'shape';
  props: any; // This will be different based on the type
  position: { x: number, y: number };
  size: { width: number, height: number };
  angle: number;
  zIndex: number;
};

// Define our slide type
export type Slide = {
  id: number;
  elements: SlideElement[];
  notes: string;
  thumbnail?: string;
};

// Define the viewer mode type
export type ViewerMode = "presentation" | "edit" | "review";

// Define our store state
interface SlideState {
  slides: Slide[];
  currentSlide: number;
  zoom: number;
  viewerMode: ViewerMode;
  isFullScreen: boolean;
  leftSidebarOpen: boolean;
  showPresenterNotes: boolean;
  presentationStartTime: Date | null;
  displayCount: number;
  
  // Actions
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
  updateElement: (slideId: number, elementId: string, props: Partial<SlideElement>) => void;
  addElement: (slideId: number, element: SlideElement) => void;
  removeElement: (slideId: number, elementId: string) => void;
  setDisplayCount: (count: number) => void;
}

// Mock slide data similar to what you have
const mockSlides: Slide[] = [
  {
    id: 1,
    elements: [],
    notes: "このスライドでは、Q4の業績についての概要を説明します。市場予測よりも20%増の売上を記録したことを強調しましょう。"
  },
  {
    id: 2,
    elements: [],
    notes: "会社概要では、特に海外展開の強化について触れてください。アジア市場での成長率が前年比40%であることを強調。"
  },
  {
    id: 3,
    elements: [],
    notes: "財務結果では、営業利益率が業界平均を上回っていることにフォーカスしてください。昨年比で5ポイント改善。"
  },
  {
    id: 4,
    elements: [],
    notes: "将来戦略では、新製品開発のロードマップと市場投入時期について詳しく説明してください。特に第2四半期の新製品に注目。"
  },
  {
    id: 5,
    elements: [],
    notes: "質疑応答セクションでは、投資家から予想される質問への回答をあらかじめ準備しておきます。特に配当政策について。"
  }
];

// Create the store
export const useSlideStore = create<SlideState>()(
  persist(
    (set, get) => ({
      slides: mockSlides,
      currentSlide: 1,
      zoom: 100,
      viewerMode: "presentation" as ViewerMode,
      isFullScreen: false,
      leftSidebarOpen: false,
      showPresenterNotes: false,
      presentationStartTime: null,
      displayCount: 1,
      
      setCurrentSlide: (index) => set({ currentSlide: index }),
      previousSlide: () => {
        const { currentSlide } = get();
        if (currentSlide > 1) {
          set({ currentSlide: currentSlide - 1 });
        }
      },
      nextSlide: () => {
        const { currentSlide, slides } = get();
        if (currentSlide < slides.length) {
          set({ currentSlide: currentSlide + 1 });
        }
      },
      setZoom: (zoom) => set({ zoom }),
      setViewerMode: (viewerMode) => set({ viewerMode }),
      toggleLeftSidebar: () => set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),
      toggleFullScreen: () => set((state) => ({ isFullScreen: !state.isFullScreen })),
      togglePresenterNotes: () => set((state) => ({ showPresenterNotes: !state.showPresenterNotes })),
      startPresentation: () => set({ presentationStartTime: new Date(), viewerMode: "presentation" }),
      endPresentation: () => set({ presentationStartTime: null }),
      updateElement: (slideId, elementId, props) => {
        set((state) => ({
          slides: state.slides.map(slide => 
            slide.id === slideId 
              ? { 
                  ...slide, 
                  elements: slide.elements.map(el => 
                    el.id === elementId ? { ...el, ...props } : el
                  ) 
                }
              : slide
          )
        }));
      },
      addElement: (slideId, element) => {
        set((state) => ({
          slides: state.slides.map(slide => 
            slide.id === slideId 
              ? { ...slide, elements: [...slide.elements, element] } 
              : slide
          )
        }));
      },
      removeElement: (slideId, elementId) => {
        set((state) => ({
          slides: state.slides.map(slide => 
            slide.id === slideId 
              ? { ...slide, elements: slide.elements.filter(el => el.id !== elementId) } 
              : slide
          )
        }));
      },
      setDisplayCount: (displayCount) => set({ displayCount })
    }),
    {
      name: 'slide-storage',
      // Only persist certain parts of the state
      partialize: (state) => ({ 
        slides: state.slides, 
        currentSlide: state.currentSlide,
        zoom: state.zoom
      }),
    }
  )
);
