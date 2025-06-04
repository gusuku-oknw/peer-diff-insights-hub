
import { Canvas, IText, Rect, Circle, Object as FabricObject } from 'fabric';

// Define a custom type that extends fabric.Object to include our customData
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
  angle: number;
  // Remove the set method definition to inherit the correct one from FabricObject
}

// Helper function to create a text element
export function createTextElement(options: any): IText & CustomFabricObject {
  const text = new IText(options.text || 'New Text', {
    left: options.left || 0,
    top: options.top || 0,
    fontSize: options.fontSize || 24,
    fill: options.color || '#000000',
    fontFamily: options.fontFamily || 'Arial',
    originX: 'center',
    originY: 'center',
    ...options
  }) as IText & CustomFabricObject;
  
  if (options.customData) {
    text.customData = options.customData;
  }
  
  return text;
}

// Helper function to create a rectangle element
export function createRectElement(options: any): Rect & CustomFabricObject {
  const rect = new Rect({
    left: options.left || 0,
    top: options.top || 0,
    width: options.width || 100,
    height: options.height || 100,
    fill: options.fill || '#000000',
    stroke: options.stroke || '',
    strokeWidth: options.strokeWidth || 0,
    originX: 'center',
    originY: 'center',
    ...options
  }) as Rect & CustomFabricObject;
  
  if (options.customData) {
    rect.customData = options.customData;
  }
  
  return rect;
}

// Helper function to create a circle element
export function createCircleElement(options: any): Circle & CustomFabricObject {
  const circle = new Circle({
    left: options.left || 0,
    top: options.top || 0,
    radius: options.radius || 50,
    fill: options.fill || '#000000',
    stroke: options.stroke || '',
    strokeWidth: options.strokeWidth || 0,
    originX: 'center',
    originY: 'center',
    ...options
  }) as Circle & CustomFabricObject;
  
  if (options.customData) {
    circle.customData = options.customData;
  }
  
  return circle;
}

// Helper function to add customData to any Fabric object
export function addCustomDataToObject(obj: FabricObject, customData: any): CustomFabricObject {
  const customObj = obj as CustomFabricObject;
  customObj.customData = customData;
  return customObj;
}
