
import { FabricObject } from 'fabric';

// Custom Fabric.js object with additional data
export interface CustomFabricObject extends FabricObject {
  customData?: {
    id: string;
    type?: string;
    originalProps?: any;
  };
}

// Canvas dimensions and viewport
export interface CanvasViewport {
  width: number;
  height: number;
  zoom: number;
}

// Canvas event handlers
export interface CanvasEventHandlers {
  onObjectModified?: (obj: CustomFabricObject) => void;
  onObjectSelected?: (obj: CustomFabricObject | null) => void;
  onTextChanged?: (obj: CustomFabricObject) => void;
}

// Canvas initialization options
export interface CanvasInitOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  selection?: boolean;
  preserveObjectStacking?: boolean;
}
