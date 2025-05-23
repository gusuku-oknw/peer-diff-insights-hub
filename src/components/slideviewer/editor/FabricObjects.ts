
import * as fabric from 'fabric';

// Define type for custom properties we want to add to fabric objects
export interface CustomFabricObject extends fabric.Object {
  customData?: {
    id: string;
  };
}

// Helper function to create a text element
export const createTextElement = (
  text: string, 
  x: number, 
  y: number, 
  options: Partial<fabric.ITextOptions> = {}
): fabric.IText & CustomFabricObject => {
  return new fabric.IText(text, {
    left: x,
    top: y,
    fontSize: 24,
    fill: '#000000',
    fontFamily: 'Arial',
    originX: 'center',
    originY: 'center',
    ...options
  }) as fabric.IText & CustomFabricObject;
};

// Helper function to create a rectangle element
export const createRectElement = (
  x: number, 
  y: number, 
  width = 150, 
  height = 100,
  options: Partial<fabric.RectOptions> = {}
): fabric.Rect & CustomFabricObject => {
  return new fabric.Rect({
    left: x,
    top: y,
    width,
    height,
    fill: '#4287f5',
    stroke: '#2054a8',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    ...options
  }) as fabric.Rect & CustomFabricObject;
};

// Helper function to create a circle element
export const createCircleElement = (
  x: number, 
  y: number, 
  radius = 50,
  options: Partial<fabric.CircleOptions> = {}
): fabric.Circle & CustomFabricObject => {
  return new fabric.Circle({
    left: x,
    top: y,
    radius,
    fill: '#f54242',
    stroke: '#8a2727',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    ...options
  }) as fabric.Circle & CustomFabricObject;
};

// Helper function to add custom data to fabric objects
export const addCustomDataToObject = (
  object: CustomFabricObject, 
  id: string
): CustomFabricObject => {
  object.customData = { id };
  return object;
};
