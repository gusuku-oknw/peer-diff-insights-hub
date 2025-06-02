
import { FabricObject } from 'fabric';

export interface CustomFabricObject extends FabricObject {
  customData?: {
    id: string;
    type: string;
    slideId?: number;
  };
}

export interface CanvasState {
  zoom: number;
  selectedObjectId: string | null;
  isDirty: boolean;
}

export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor: string;
  selection: boolean;
  preserveObjectStacking: boolean;
}
