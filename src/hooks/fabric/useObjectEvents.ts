
import { useEffect } from 'react';
import { Canvas, IText, Rect, Circle } from 'fabric';
import { CustomFabricObject } from '@/utils/types/canvas.types';
import { SlideElement } from '@/utils/types/slide.types';

interface UseObjectEventsProps {
  canvas: Canvas | null;
  initialized: boolean;
  editable: boolean;
  onUpdateElement?: (elementId: string, updates: Partial<SlideElement>) => void;
  instanceId?: string; // Added instanceId parameter
}

export const useObjectEvents = ({
  canvas,
  initialized,
  editable,
  onUpdateElement,
  instanceId = 'default' // Default value for backward compatibility
}: UseObjectEventsProps) => {
  useEffect(() => {
    if (!canvas || !initialized || !editable || !onUpdateElement) return;

    console.log(`[Instance ${instanceId}] Setting up object events`);

    // オブジェクト修正イベント
    const handleObjectModified = (e: any) => {
      const obj = e.target as unknown as CustomFabricObject;
      if (!obj || !obj.customData?.id) return;
      
      const updates: any = {};
      
      // スケーリングを考慮した実際の寸法を計算
      let width, height;
      
      if (obj.type === 'rect') {
        const rect = obj as unknown as Rect;
        width = (rect.width || 0) * (obj.scaleX || 1);
        height = (rect.height || 0) * (obj.scaleY || 1);
        
        // 二重スケーリングを避けるためのリセット
        obj.set({
          width: width,
          height: height,
          scaleX: 1,
          scaleY: 1
        });
      } else if (obj.type === 'circle') {
        const circle = obj as unknown as Circle;
        const radius = (circle as any).radius || 0;
        const scale = obj.scaleX || 1; // アスペクト比を維持するため、X軸のみを考慮
        width = radius * 2 * scale;
        height = radius * 2 * scale;
        
        // 二重スケーリングを避けるためのリセット
        obj.set({
          radius: width / 2,
          scaleX: 1,
          scaleY: 1
        });
      } else if (obj.type === 'text') {
        const text = obj as unknown as IText;
        width = (text.width || 0) * (obj.scaleX || 1);
        height = (text.height || 0) * (obj.scaleY || 1);
        
        // 二重スケーリングを避けるためのリセット
        obj.set({
          width: width,
          scaleX: 1,
          scaleY: 1
        });
      } else if (obj.type === 'image') {
        const img = obj as any;
        width = (img.width || 0) * (obj.scaleX || 1);
        height = (img.height || 0) * (obj.scaleY || 1);
      } else {
        width = obj.width || 0;
        height = obj.height || 0;
      }
      
      updates.position = { 
        x: obj.left || 0, 
        y: obj.top || 0 
      };
      
      updates.size = { width, height };
      updates.angle = obj.angle || 0;
      
      // ストア内のオブジェクトを更新
      onUpdateElement(obj.customData.id, updates);
      
      canvas.renderAll();
    };
    
    // テキスト編集イベント
    const handleTextChanged = (e: any) => {
      const textObj = e.target as unknown as IText & CustomFabricObject;
      if (!textObj || !textObj.customData?.id) return;
      
      onUpdateElement(textObj.customData.id, {
        props: {
          text: textObj.text
        }
      });
    };

    canvas.on('object:modified', handleObjectModified);
    canvas.on('text:changed', handleTextChanged);

    console.log(`[Instance ${instanceId}] Object events set up successfully`);

    return () => {
      console.log(`[Instance ${instanceId}] Removing object event handlers`);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('text:changed', handleTextChanged);
    };
  }, [canvas, initialized, editable, onUpdateElement, instanceId]);
};
