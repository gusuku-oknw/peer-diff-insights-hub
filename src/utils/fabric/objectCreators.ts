import { IText, Rect, Circle, Image } from 'fabric';
// Fix the import path - use the correct canvas types
import type { SlideElement } from '@/types/slide.types';

// Utility functions to create Fabric.js objects from slide elements
export const createFabricText = (element: SlideElement) => {
  const { position, props } = element;
  return new IText(props.text || 'New Text', {
    left: position?.x || 0,
    top: position?.y || 0,
    fontSize: props.fontSize || 24,
    fill: props.color || '#222222',
    fontFamily: props.fontFamily || 'Arial',
    originX: 'center',
    originY: 'center',
  });
};

export const createFabricRectangle = (element: SlideElement) => {
  const { position, size, props } = element;
  return new Rect({
    left: position?.x || 0,
    top: position?.y || 0,
    width: size?.width || 100,
    height: size?.height || 100,
    fill: props.fill || '#999999',
    stroke: props.stroke || '',
    strokeWidth: props.strokeWidth || 0,
    originX: 'center',
    originY: 'center',
  });
};

export const createFabricCircle = (element: SlideElement) => {
  const { position, size, props } = element;
  return new Circle({
    left: position?.x || 0,
    top: position?.y || 0,
    radius: (size?.width || 100) / 2,
    fill: props.fill || '#AAAAAA',
    stroke: props.stroke || '',
    strokeWidth: props.strokeWidth || 0,
    originX: 'center',
    originY: 'center',
  });
};

export const createFabricImage = (element: SlideElement) => {
  return new Promise<Image>((resolve, reject) => {
    if (element.props.src) {
      Image.fromURL(element.props.src, {
        crossOrigin: 'anonymous'
      }).then(img => {
        img.set({
          left: element.position?.x || 0,
          top: element.position?.y || 0,
          scaleX: element.size?.width ? element.size.width / (img.width || 1) : 1,
          scaleY: element.size?.height ? element.size.height / (img.height || 1) : 1,
          originX: 'center',
          originY: 'center',
        });
        resolve(img);
      }).catch(reject);
    } else {
      reject(new Error('Image source is missing'));
    }
  });
};
