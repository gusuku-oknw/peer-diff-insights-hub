
import { Canvas, IText, Rect, Circle, Image } from 'fabric';

// 拡張要素レンダリング関数（空状態対応版）
export const renderElementsWithEmptyState = (
  canvas: Canvas,
  elements: any[],
  canvasSize: { width: number; height: number },
  editable: boolean,
  currentSlide: number,
  addText: () => void,
  addShape: () => void,
  addImage: () => void
) => {
  if (!canvas) return { isEmpty: true };
  
  // 既存のオブジェクトをクリア
  canvas.clear();
  canvas.backgroundColor = '#ffffff';

  const isEmpty = !elements || elements.length === 0;
  if (isEmpty) {
    canvas.renderAll();
    return { isEmpty: true };
  }

  // Canvasサイズに基づくスケーリング
  const scaleX = canvasSize.width / 1600;
  const scaleY = canvasSize.height / 900;
  const scale = Math.min(scaleX, scaleY);

  // Z-index順に描画
  const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  
  sortedElements.forEach(element => {
    const { type, position, size, props = {}, id, angle } = element;
    try {
      switch (type) {
        case 'text': {
          const text = new IText(props.text || 'New Text', {
            left: (position?.x || 0) * scaleX,
            top: (position?.y || 0) * scaleY,
            fontSize: (props.fontSize || 24) * scale,
            fill: props.color || '#222222',
            fontFamily: props.fontFamily || 'Arial',
            originX: 'center',
            originY: 'center',
            editable,
            selectable: editable,
            angle: angle || 0,
          });
          (text as any).customData = { id, type };
          canvas.add(text);
          break;
        }
        case 'shape':
        case 'rectangle': {
          // 長方形/四角形
          const rect = new Rect({
            left: (position?.x || 0) * scaleX,
            top: (position?.y || 0) * scaleY,
            width: (size?.width || 100) * scaleX,
            height: (size?.height || 100) * scaleY,
            fill: props.fill || '#999999',
            stroke: props.stroke || '',
            strokeWidth: (props.strokeWidth || 0) * scale,
            originX: 'center',
            originY: 'center',
            selectable: editable,
            angle: angle || 0,
          });
          (rect as any).customData = { id, type };
          canvas.add(rect);
          break;
        }
        case 'circle': {
          const circle = new Circle({
            left: (position?.x || 0) * scaleX,
            top: (position?.y || 0) * scaleY,
            radius: ((size?.width || 100) / 2) * scale,
            fill: props.fill || '#AAAAAA',
            stroke: props.stroke || '',
            strokeWidth: (props.strokeWidth || 0) * scale,
            originX: 'center',
            originY: 'center',
            selectable: editable,
            angle: angle || 0,
          });
          (circle as any).customData = { id, type };
          canvas.add(circle);
          break;
        }
        case 'image': {
          // 画像は非同期
          if (props.src) {
            Image.fromURL(props.src, {
              crossOrigin: 'anonymous'
            }).then(img => {
              img.set({
                left: (position?.x || 0) * scaleX,
                top: (position?.y || 0) * scaleY,
                scaleX: (size?.width ? size.width / (img.width || 1) : 1) * scaleX,
                scaleY: (size?.height ? size.height / (img.height || 1) : 1) * scaleY,
                originX: 'center',
                originY: 'center',
                selectable: editable,
                angle: angle || 0,
              });
              (img as any).customData = { id, type };
              canvas.add(img);
              canvas.renderAll();
            });
          }
          break;
        }
        default:
          // 何もしない
          break;
      }
    } catch (renderErr) {
      console.warn('Element rendering error for', type, renderErr);
    }
  });
  canvas.renderAll();

  return { isEmpty: false };
};
