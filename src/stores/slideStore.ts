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
  generateThumbnails: () => void;
  exportToPPTX: () => void;
}

// Mock slide data similar to what you have
const mockSlides: Slide[] = [
  {
    id: 1,
    elements: [
      {
        id: 'title-1',
        type: 'text',
        props: {
          text: '第4四半期業績報告',
          fontSize: 48,
          color: '#333333',
          fontFamily: 'Arial',
          fontWeight: 'bold',
        },
        position: { x: 800, y: 250 },
        size: { width: 600, height: 80 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: 'subtitle-1',
        type: 'text',
        props: {
          text: '2024年度 市場予測より20%増',
          fontSize: 28,
          color: '#666666',
          fontFamily: 'Arial',
        },
        position: { x: 800, y: 350 },
        size: { width: 500, height: 50 },
        angle: 0,
        zIndex: 2,
      },
      {
        id: 'rect-1',
        type: 'shape',
        props: {
          shape: 'rect',
          fill: '#4287f5',
          stroke: '#2054a8',
          strokeWidth: 2,
        },
        position: { x: 200, y: 450 },
        size: { width: 300, height: 200 },
        angle: 0,
        zIndex: 0,
      }
    ],
    notes: "このスライドでは、Q4の業績についての概要を説明します。市場予測よりも20%増の売上を記録したことを強調しましょう。",
    thumbnail: ""
  },
  {
    id: 2,
    elements: [
      {
        id: 'title-2',
        type: 'text',
        props: {
          text: '会社概要',
          fontSize: 40,
          color: '#333333',
          fontFamily: 'Arial',
          fontWeight: 'bold',
        },
        position: { x: 800, y: 150 },
        size: { width: 400, height: 60 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: 'content-2',
        type: 'text',
        props: {
          text: '海外展開の強化：アジア市場での成長率が前年比40%',
          fontSize: 24,
          color: '#444444',
          fontFamily: 'Arial',
        },
        position: { x: 800, y: 300 },
        size: { width: 800, height: 100 },
        angle: 0,
        zIndex: 2,
      },
      {
        id: 'circle-2',
        type: 'shape',
        props: {
          shape: 'circle',
          fill: '#f54242',
          stroke: '#8a2727',
          strokeWidth: 2,
        },
        position: { x: 250, y: 300 },
        size: { width: 200, height: 200 },
        angle: 0,
        zIndex: 0,
      }
    ],
    notes: "会社概要では、特に海外展開の強化について触れてください。アジア市場での成長率が前年比40%であることを強調。",
    thumbnail: ""
  },
  {
    id: 3,
    elements: [
      {
        id: 'title-3',
        type: 'text',
        props: {
          text: '財務結果',
          fontSize: 40,
          color: '#333333',
          fontFamily: 'Arial',
          fontWeight: 'bold',
        },
        position: { x: 800, y: 150 },
        size: { width: 400, height: 60 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: 'content-3',
        type: 'text',
        props: {
          text: '営業利益率が業界平均を上回る：昨年比で5ポイント改善',
          fontSize: 24,
          color: '#444444',
          fontFamily: 'Arial',
        },
        position: { x: 800, y: 300 },
        size: { width: 800, height: 100 },
        angle: 0,
        zIndex: 2,
      },
      {
        id: 'rect-3',
        type: 'shape',
        props: {
          shape: 'rect',
          fill: '#42f5ad',
          stroke: '#27a872',
          strokeWidth: 2,
        },
        position: { x: 300, y: 350 },
        size: { width: 400, height: 150 },
        angle: 30,
        zIndex: 0,
      }
    ],
    notes: "財務結果では、営業利益率が業界平均を上回っていることにフォーカスしてください。昨年比で5ポイント改善。",
    thumbnail: ""
  },
  {
    id: 4,
    elements: [
      {
        id: 'title-4',
        type: 'text',
        props: {
          text: '将来戦略',
          fontSize: 40,
          color: '#333333',
          fontFamily: 'Arial',
          fontWeight: 'bold',
        },
        position: { x: 800, y: 150 },
        size: { width: 400, height: 60 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: 'content-4',
        type: 'text',
        props: {
          text: '新製品開発のロードマップと市場投入時期：第2四半期の新製品に注目',
          fontSize: 24,
          color: '#444444',
          fontFamily: 'Arial',
        },
        position: { x: 800, y: 300 },
        size: { width: 800, height: 100 },
        angle: 0,
        zIndex: 2,
      },
      {
        id: 'circle-4',
        type: 'shape',
        props: {
          shape: 'circle',
          fill: '#f5e642',
          stroke: '#a89927',
          strokeWidth: 2,
        },
        position: { x: 250, y: 300 },
        size: { width: 250, height: 250 },
        angle: 0,
        zIndex: 0,
      }
    ],
    notes: "将来戦略では、新製品開発のロードマップと市場投入時期について詳しく説明してください。特に第2四半期の新製品に注目。",
    thumbnail: ""
  },
  {
    id: 5,
    elements: [
      {
        id: 'title-5',
        type: 'text',
        props: {
          text: '質疑応答',
          fontSize: 48,
          color: '#333333',
          fontFamily: 'Arial',
          fontWeight: 'bold',
        },
        position: { x: 800, y: 400 },
        size: { width: 400, height: 80 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: 'rect-5-1',
        type: 'shape',
        props: {
          shape: 'rect',
          fill: '#9e42f5',
          stroke: '#5e27a8',
          strokeWidth: 2,
        },
        position: { x: 200, y: 300 },
        size: { width: 200, height: 150 },
        angle: 15,
        zIndex: 0,
      },
      {
        id: 'rect-5-2',
        type: 'shape',
        props: {
          shape: 'rect',
          fill: '#f542b3',
          stroke: '#a8276c',
          strokeWidth: 2,
        },
        position: { x: 1200, y: 300 },
        size: { width: 200, height: 150 },
        angle: -15,
        zIndex: 0,
      }
    ],
    notes: "質疑応答セクションでは、投資家から予想される質問への回答をあらかじめ準備しておきます。特に配当政策について。",
    thumbnail: ""
  }
];

// Now, add thumbnail generation and PPTX export functions
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
      setDisplayCount: (displayCount) => set({ displayCount }),
      
      generateThumbnails: () => {
        console.log("Generating thumbnails...");
        // In a real implementation, this would create thumbnails from the slides
        // For now, we'll just set placeholder thumbnails
        set((state) => ({
          slides: state.slides.map(slide => ({
            ...slide,
            thumbnail: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='90' viewBox='0 0 160 90' fill='none'%3E%3Crect width='160' height='90' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%231e293b'%3ESlide ${slide.id}%3C/text%3E%3C/svg%3E`
          }))
        }));
      },
      
      exportToPPTX: () => {
        console.log("Exporting to PPTX...");
        // In a real implementation, this would generate a PPTX file
        // For now, we'll just show a message
        alert("スライドをPPTXとして出力中...\nこの機能は実装中です。");
      }
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
