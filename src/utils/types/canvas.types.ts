
import { Canvas, Object as FabricObject } from 'fabric';
import { SlideElement } from './slide.types';

// Fabric用のカスタムオブジェクト型定義
export interface CustomFabricObject extends FabricObject {
  customData?: {
    id: string;
    [key: string]: any;
  };
  type: string;
  width: number;
  height: number;
  left: number;
  top: number;
  scaleX: number;
  scaleY: number;
  angle: number; // Changed from optional to required
  set?: (options: any) => CustomFabricObject;
}

// キャンバスフックのプロパティ型
export interface UseFabricCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
  elements?: SlideElement[];
  onUpdateElement?: (elementId: string, updates: Partial<SlideElement>) => void;
  onSelectElement?: (element: CustomFabricObject | null) => void;
}

// キャンバスフックの戻り値型
export interface UseFabricCanvasResult {
  canvas: Canvas | null;
  initialized: boolean;
  renderElements: (elements: SlideElement[]) => void;
  reset: () => void;
  selectedObject: CustomFabricObject | null;
}
