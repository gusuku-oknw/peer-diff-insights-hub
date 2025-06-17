
import { IText, Rect, Circle } from 'fabric';
import { CustomFabricObject } from '@/utils/types/canvas.types';

// テキスト要素の作成
export const createTextElement = (options: any): IText & CustomFabricObject => {
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
};

// 長方形要素の作成
export const createRectElement = (options: any): Rect & CustomFabricObject => {
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
};

// 円要素の作成
export const createCircleElement = (options: any): Circle & CustomFabricObject => {
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
};
