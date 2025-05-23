
import { fabric } from 'fabric/fabric-impl';

// Define a custom type that extends fabric.Object to include our customData
export interface CustomFabricObject extends fabric.Object {
  customData?: {
    id: string;
    [key: string]: any;
  };
}

// Helper function to create a text element
export function createTextElement(options: any): fabric.IText & CustomFabricObject {
  const text = new fabric.IText(options.text || 'New Text', {
    left: options.left || 0,
    top: options.top || 0,
    fontSize: options.fontSize || 24,
    fill: options.color || '#000000',
    fontFamily: options.fontFamily || 'Arial',
    originX: 'center',
    originY: 'center',
    ...options
  }) as fabric.IText & CustomFabricObject;
  
  if (options.customData) {
    text.customData = options.customData;
  }
  
  return text;
}

// Helper function to create a rectangle element
export function createRectElement(options: any): fabric.Rect & CustomFabricObject {
  const rect = new fabric.Rect({
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
  }) as fabric.Rect & CustomFabricObject;
  
  if (options.customData) {
    rect.customData = options.customData;
  }
  
  return rect;
}

// Helper function to create a circle element
export function createCircleElement(options: any): fabric.Circle & CustomFabricObject {
  const circle = new fabric.Circle({
    left: options.left || 0,
    top: options.top || 0,
    radius: options.radius || 50,
    fill: options.fill || '#000000',
    stroke: options.stroke || '',
    strokeWidth: options.strokeWidth || 0,
    originX: 'center',
    originY: 'center',
    ...options
  }) as fabric.Circle & CustomFabricObject;
  
  if (options.customData) {
    circle.customData = options.customData;
  }
  
  return circle;
}

// Helper function to add customData to any Fabric object
export function addCustomDataToObject(obj: fabric.Object, customData: any): CustomFabricObject {
  const customObj = obj as CustomFabricObject;
  customObj.customData = customData;
  return customObj;
}
