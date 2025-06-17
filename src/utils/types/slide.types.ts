
// 基本的なスライド要素の型定義
export type SlideElementType = 'text' | 'image' | 'shape';

export type SlideElement = {
  id: string;
  type: SlideElementType;
  props: any; // This will be different based on the type
  position: { x: number, y: number };
  size: { width: number, height: number };
  angle: number;
  zIndex: number;
};

// スライド全体の型定義
export type Slide = {
  id: number;
  title?: string;
  elements: SlideElement[];
  notes: string;
  thumbnail?: string;
};

// ビューアモードの型定義
export type ViewerMode = "presentation" | "edit" | "review";
