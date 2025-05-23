import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StateCreator } from 'zustand';
import { PPTXImportSlice, createPPTXImportSlice } from './slideStoreExtensions';

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
  title?: string; // Added title property as optional
  elements: SlideElement[];
  notes: string;
  thumbnail?: string;
};

// Define the viewer mode type
export type ViewerMode = "presentation" | "edit" | "review";

// Define our store state
export interface SlideStore {
  slides: Slide[];
  currentSlide: number;
  zoom: number;
  viewerMode: ViewerMode;
  isFullScreen: boolean;
  leftSidebarOpen: boolean;
  showPresenterNotes: boolean;
  presentationStartTime: Date | null;
  displayCount: number;
  isPPTXImported: boolean;
  pptxFilename: string | null;
  setPPTXImported: (imported: boolean, filename?: string | null) => void;
  importSlidesFromPPTX: (slidesData: Slide[]) => void;
  
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

// Enhanced sample slides with more content
const createSampleSlides = (): Slide[] => [
  // Slide 1: Title slide
  {
    id: 1,
    title: "2025年度 第4四半期 事業報告",
    elements: [
      {
        id: "title-1",
        type: "text",
        props: { 
          text: "2025年度 第4四半期 事業報告",
          fontSize: 48,
          color: "#1e40af",
          fontFamily: "Arial",
          fontWeight: "bold",
        },
        position: { x: 800, y: 300 },
        size: { width: 1000, height: 60 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "subtitle-1",
        type: "text",
        props: { 
          text: "ABC株式会社",
          fontSize: 32,
          color: "#475569",
          fontFamily: "Arial",
          fontWeight: "normal",
        },
        position: { x: 800, y: 400 },
        size: { width: 500, height: 40 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "date-1",
        type: "text",
        props: { 
          text: "2025年5月23日",
          fontSize: 24,
          color: "#64748b",
          fontFamily: "Arial",
          fontWeight: "normal",
        },
        position: { x: 800, y: 500 },
        size: { width: 200, height: 30 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "logo-bg-1",
        type: "shape",
        props: { 
          shape: "rect",
          fill: "#3b82f6",
          stroke: "",
          strokeWidth: 0,
        },
        position: { x: 200, y: 300 },
        size: { width: 150, height: 150 },
        angle: 45,
        zIndex: 0,
      },
      {
        id: "logo-circle-1",
        type: "shape",
        props: { 
          shape: "circle",
          fill: "#1d4ed8",
          stroke: "",
          strokeWidth: 0,
        },
        position: { x: 200, y: 300 },
        size: { width: 80, height: 80 },
        angle: 0,
        zIndex: 1,
      }
    ],
    thumbnail: null,
    notes: "開始の挨拶と会社紹介を簡潔に行い、この四半期の注目ポイントを3つ挙げる"
  },
  
  // Slide 2: Company Overview
  {
    id: 2,
    title: "会社概要",
    elements: [
      {
        id: "header-2",
        type: "text",
        props: { 
          text: "会社概要",
          fontSize: 40,
          color: "#1e40af",
          fontFamily: "Arial",
          fontWeight: "bold",
        },
        position: { x: 800, y: 100 },
        size: { width: 200, height: 50 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "overview-2",
        type: "text",
        props: { 
          text: "・設立: 2010年6月\n・従業員数: 450名\n・主要事業: ソフトウェア開発、コンサルティング\n・拠点: 東京、大阪、福岡、シンガポール",
          fontSize: 24,
          color: "#334155",
          fontFamily: "Arial",
          fontWeight: "normal",
        },
        position: { x: 400, y: 400 },
        size: { width: 600, height: 200 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "vision-2",
        type: "text",
        props: { 
          text: "企業理念: 技術の力で社会に貢献する",
          fontSize: 28,
          color: "#334155",
          fontFamily: "Arial",
          fontWeight: "bold",
        },
        position: { x: 800, y: 600 },
        size: { width: 600, height: 40 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "bg-rect-2",
        type: "shape",
        props: { 
          shape: "rect",
          fill: "#dbeafe",
          stroke: "#bfdbfe",
          strokeWidth: 2,
        },
        position: { x: 1200, y: 400 },
        size: { width: 500, height: 300 },
        angle: 0,
        zIndex: 0,
      }
    ],
    thumbnail: null,
    notes: "簡潔に会社概要を説明し、成長の背景や強みについても触れる"
  },
  
  // Slide 3: Financial Results
  {
    id: 3,
    title: "第4四半期 業績ハイライト",
    elements: [
      {
        id: "header-3",
        type: "text",
        props: { 
          text: "第4四半期 業績ハイライト",
          fontSize: 40,
          color: "#1e40af",
          fontFamily: "Arial",
          fontWeight: "bold",
        },
        position: { x: 800, y: 100 },
        size: { width: 500, height: 50 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "revenue-3",
        type: "text",
        props: { 
          text: "売上高: 25億円（前年比+18%）",
          fontSize: 28,
          color: "#334155",
          fontFamily: "Arial",
          fontWeight: "bold",
        },
        position: { x: 800, y: 250 },
        size: { width: 500, height: 40 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "profit-3",
        type: "text",
        props: { 
          text: "営業利益: 5.2億円（前年比+22%）",
          fontSize: 28,
          color: "#334155",
          fontFamily: "Arial",
          fontWeight: "bold",
        },
        position: { x: 800, y: 350 },
        size: { width: 500, height: 40 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "highlight-3",
        type: "text",
        props: { 
          text: "• 新規顧客獲得率が30%向上\n• クラウド事業が全体の45%に成長\n• 海外展開が順調で売上の20%を占める",
          fontSize: 24,
          color: "#334155",
          fontFamily: "Arial",
          fontWeight: "normal",
        },
        position: { x: 800, y: 550 },
        size: { width: 600, height: 150 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "chart-rect-3",
        type: "shape",
        props: { 
          shape: "rect",
          fill: "#bfdbfe",
          stroke: "#3b82f6",
          strokeWidth: 2,
        },
        position: { x: 400, y: 450 },
        size: { width: 400, height: 300 },
        angle: 0,
        zIndex: 0,
      },
      {
        id: "chart-text-3",
        type: "text",
        props: { 
          text: "四半期売上グラフ",
          fontSize: 20,
          color: "#1e40af",
          fontFamily: "Arial",
          fontWeight: "normal",
        },
        position: { x: 400, y: 600 },
        size: { width: 200, height: 30 },
        angle: 0,
        zIndex: 1,
      }
    ],
    thumbnail: null,
    notes: "売上の伸び率の要因と、各事業部門の貢献度について詳細に説明。特に新規プロジェクトがどのように貢献したかを強調する。"
  },
  
  // Slide 4: Future Strategy
  {
    id: 4,
    title: "今後の戦略",
    elements: [
      {
        id: "header-4",
        type: "text",
        props: { 
          text: "今後の戦略",
          fontSize: 40,
          color: "#1e40af",
          fontFamily: "Arial",
          fontWeight: "bold",
        },
        position: { x: 800, y: 100 },
        size: { width: 300, height: 50 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "strategy-1-4",
        type: "text",
        props: { 
          text: "1. AI技術の積極的導入",
          fontSize: 30,
          color: "#1e40af",
          fontFamily: "Arial",
          fontWeight: "bold",
        },
        position: { x: 400, y: 250 },
        size: { width: 400, height: 40 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "strategy-1-desc-4",
        type: "text",
        props: { 
          text: "製品へのAI機能統合と社内業務効率化",
          fontSize: 20,
          color: "#334155",
          fontFamily: "Arial",
          fontWeight: "normal",
        },
        position: { x: 400, y: 300 },
        size: { width: 400, height: 30 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "strategy-2-4",
        type: "text",
        props: { 
          text: "2. アジア市場への展開強化",
          fontSize: 30,
          color: "#1e40af",
          fontFamily: "Arial",
          fontWeight: "bold",
        },
        position: { x: 1200, y: 250 },
        size: { width: 400, height: 40 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "strategy-2-desc-4",
        type: "text",
        props: { 
          text: "ベトナム・タイを中心に営業所開設",
          fontSize: 20,
          color: "#334155",
          fontFamily: "Arial",
          fontWeight: "normal",
        },
        position: { x: 1200, y: 300 },
        size: { width: 400, height: 30 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "strategy-3-4",
        type: "text",
        props: { 
          text: "3. サブスクリプション型モデルの拡充",
          fontSize: 30,
          color: "#1e40af",
          fontFamily: "Arial",
          fontWeight: "bold",
        },
        position: { x: 400, y: 450 },
        size: { width: 500, height: 40 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "strategy-3-desc-4",
        type: "text",
        props: { 
          text: "安定収益基盤の強化を目指す",
          fontSize: 20,
          color: "#334155",
          fontFamily: "Arial",
          fontWeight: "normal",
        },
        position: { x: 400, y: 500 },
        size: { width: 400, height: 30 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "strategy-4-4",
        type: "text",
        props: { 
          text: "4. 技術人材の採用・育成強化",
          fontSize: 30,
          color: "#1e40af",
          fontFamily: "Arial",
          fontWeight: "bold",
        },
        position: { x: 1200, y: 450 },
        size: { width: 500, height: 40 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "strategy-4-desc-4",
        type: "text",
        props: { 
          text: "今年度はエンジニア50名増員予定",
          fontSize: 20,
          color: "#334155",
          fontFamily: "Arial",
          fontWeight: "normal",
        },
        position: { x: 1200, y: 500 },
        size: { width: 400, height: 30 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "target-4",
        type: "text",
        props: { 
          text: "目標: 2026年度に売上高100億円を達成",
          fontSize: 28,
          color: "#1e40af",
          fontFamily: "Arial",
          fontWeight: "bold",
        },
        position: { x: 800, y: 650 },
        size: { width: 600, height: 40 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "bg-rect-1-4",
        type: "shape",
        props: { 
          shape: "rect",
          fill: "#dbeafe",
          stroke: "",
          strokeWidth: 0,
        },
        position: { x: 400, y: 350 },
        size: { width: 500, height: 200 },
        angle: 0,
        zIndex: 0,
      },
      {
        id: "bg-rect-2-4",
        type: "shape",
        props: { 
          shape: "rect",
          fill: "#dbeafe",
          stroke: "",
          strokeWidth: 0,
        },
        position: { x: 1200, y: 350 },
        size: { width: 500, height: 200 },
        angle: 0,
        zIndex: 0,
      }
    ],
    thumbnail: null,
    notes: "各戦略の投資予定額や期待されるROIについての詳細データを用意しておく。質問が出た際に対応できるようにする。"
  },
  
  // Slide 5: Q&A
  {
    id: 5,
    title: "ご質問・ご意見",
    elements: [
      {
        id: "header-5",
        type: "text",
        props: { 
          text: "ご質問・ご意見",
          fontSize: 48,
          color: "#1e40af",
          fontFamily: "Arial",
          fontWeight: "bold",
        },
        position: { x: 800, y: 350 },
        size: { width: 500, height: 60 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "contact-5",
        type: "text",
        props: { 
          text: "お問い合わせ: info@abc-company.co.jp",
          fontSize: 24,
          color: "#475569",
          fontFamily: "Arial",
          fontWeight: "normal",
        },
        position: { x: 800, y: 500 },
        size: { width: 600, height: 30 },
        angle: 0,
        zIndex: 1,
      },
      {
        id: "bg-circle-1-5",
        type: "shape",
        props: { 
          shape: "circle",
          fill: "#93c5fd",
          stroke: "",
          strokeWidth: 0,
        },
        position: { x: 200, y: 200 },
        size: { width: 100, height: 100 },
        angle: 0,
        zIndex: 0,
      },
      {
        id: "bg-circle-2-5",
        type: "shape",
        props: { 
          shape: "circle",
          fill: "#60a5fa",
          stroke: "",
          strokeWidth: 0,
        },
        position: { x: 1400, y: 200 },
        size: { width: 100, height: 100 },
        angle: 0,
        zIndex: 0,
      },
      {
        id: "bg-circle-3-5",
        type: "shape",
        props: { 
          shape: "circle",
          fill: "#3b82f6",
          stroke: "",
          strokeWidth: 0,
        },
        position: { x: 200, y: 700 },
        size: { width: 100, height: 100 },
        angle: 0,
        zIndex: 0,
      },
      {
        id: "bg-circle-4-5",
        type: "shape",
        props: { 
          shape: "circle",
          fill: "#2563eb",
          stroke: "",
          strokeWidth: 0,
        },
        position: { x: 1400, y: 700 },
        size: { width: 100, height: 100 },
        angle: 0,
        zIndex: 0,
      }
    ],
    thumbnail: null,
    notes: "よくある質問に対する回答を事前にメモしておく。競合との比較質問、新技術導入の具体的タイムライン、採用計画の詳細などについて。"
  }
];

// Create the basic slide state creator
const createSlideStore: StateCreator<SlideStore, [], [], SlideStore> = (set, get) => {
  // Create the PPTX import slice
  const pptxImportSlice = createPPTXImportSlice(set, get);

  return {
    slides: createSampleSlides(),
    currentSlide: 1,
    zoom: 100,
    viewerMode: "edit" as ViewerMode,
    isFullScreen: false,
    leftSidebarOpen: false,
    showPresenterNotes: false,
    presentationStartTime: null,
    displayCount: 1,
    
    // Add PPTX import slice properties
    ...pptxImportSlice,
    
    setCurrentSlide: (index) => {
      set({ currentSlide: index });
    },
    
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
    
    setZoom: (zoom) => {
      set({ zoom });
    },
    
    setViewerMode: (mode) => {
      set({ viewerMode: mode });
    },
    
    toggleLeftSidebar: () => {
      const { leftSidebarOpen } = get();
      set({ leftSidebarOpen: !leftSidebarOpen });
    },
    
    toggleFullScreen: () => {
      const { isFullScreen } = get();
      set({ isFullScreen: !isFullScreen });
    },
    
    togglePresenterNotes: () => {
      const { showPresenterNotes } = get();
      set({ showPresenterNotes: !showPresenterNotes });
    },
    
    startPresentation: () => {
      set({ presentationStartTime: new Date() });
    },
    
    endPresentation: () => {
      set({ presentationStartTime: null });
    },
    
    updateElement: (slideId, elementId, updates) => {
      const { slides } = get();
      
      const updatedSlides = slides.map(slide => {
        if (slide.id !== slideId) return slide;
        
        const updatedElements = slide.elements.map(element => {
          if (element.id !== elementId) return element;
          
          return {
            ...element,
            ...updates,
            props: updates.props ? { ...element.props, ...updates.props } : element.props,
            position: updates.position ? { ...element.position, ...updates.position } : element.position,
            size: updates.size ? { ...element.size, ...updates.size } : element.size
          };
        });
        
        return { ...slide, elements: updatedElements };
      });
      
      set({ slides: updatedSlides });
    },
    
    addElement: (slideId, element) => {
      const { slides } = get();
      
      const updatedSlides = slides.map(slide => {
        if (slide.id !== slideId) return slide;
        
        return {
          ...slide,
          elements: [...slide.elements, element]
        };
      });
      
      set({ slides: updatedSlides });
    },
    
    removeElement: (slideId, elementId) => {
      const { slides } = get();
      
      const updatedSlides = slides.map(slide => {
        if (slide.id !== slideId) return slide;
        
        return {
          ...slide,
          elements: slide.elements.filter(el => el.id !== elementId)
        };
      });
      
      set({ slides: updatedSlides });
    },
    
    setDisplayCount: (count) => {
      set({ displayCount: count });
    },
    
    generateThumbnails: () => {
      console.log("Generating thumbnails for slides");
      // In a real implementation, this would create thumbnails for each slide
      // For now, we'll just add a placeholder
      const { slides } = get();
      
      const updatedSlides = slides.map(slide => ({
        ...slide,
        thumbnail: slide.thumbnail || `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="113" viewBox="0 0 200 113"><rect width="200" height="113" fill="%23f0f0f0"/><text x="100" y="60" font-family="Arial" font-size="16" text-anchor="middle" fill="%23666">Slide ${slide.id}</text></svg>`
      }));
      
      set({ slides: updatedSlides });
    },
    
    exportToPPTX: () => {
      console.log("Exporting presentation to PPTX format");
      // This would be implemented with a library like JSZip, PptxGenJS, etc.
      alert("PPTX export functionality is coming soon!");
    }
  };
};

// Create the slide store with proper types
export const useSlideStore = create<SlideStore>()(
  persist(
    (set, get, api) => {
      // Return the combined state
      return createSlideStore(set, get, api);
    },
    {
      name: 'slide-storage',
      // Only persist certain parts of the state
      partialize: (state) => ({ 
        slides: state.slides, 
        currentSlide: state.currentSlide,
        zoom: state.zoom,
        isPPTXImported: state.isPPTXImported,
        pptxFilename: state.pptxFilename
      }),
    }
  )
);
