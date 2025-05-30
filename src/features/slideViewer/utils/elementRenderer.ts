
import { IText, Rect, Circle, Image } from 'fabric';

export const renderElements = (canvas: any, elements: any[], canvasSize: { width: number; height: number }, editable: boolean, currentSlide: number) => {
  try {
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    
    if (elements.length === 0) {
      const placeholder = new IText(`スライド ${currentSlide}`, {
        left: canvasSize.width / 2,
        top: canvasSize.height / 2,
        fontSize: Math.min(36, canvasSize.width / 25),
        fill: '#64748b',
        fontFamily: 'Arial',
        originX: 'center',
        originY: 'center',
        selectable: false,
        editable: false,
      });
      canvas.add(placeholder);
      canvas.renderAll();
      return;
    }
    
    const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    
    sortedElements.forEach(element => {
      const { type, position, size, props, id, angle } = element;
      
      const scaleX = canvasSize.width / 1600;
      const scaleY = canvasSize.height / 900;
      
      switch (type) {
        case 'text':
          const text = new IText(props.text || 'New Text', {
            left: position.x * scaleX,
            top: position.y * scaleY,
            fontSize: (props.fontSize || 24) * Math.min(scaleX, scaleY),
            fill: props.color || '#000000',
            fontFamily: props.fontFamily || 'Arial',
            originX: 'center',
            originY: 'center',
            selectable: editable,
            editable: editable,
            angle: angle || 0,
          });
          (text as any).customData = { id };
          canvas.add(text);
          break;
          
        case 'shape':
          if (props.shape === 'rect') {
            const rect = new Rect({
              left: position.x * scaleX,
              top: position.y * scaleY,
              width: size.width * scaleX,
              height: size.height * scaleY,
              fill: props.fill || '#000000',
              stroke: props.stroke || '',
              strokeWidth: (props.strokeWidth || 0) * Math.min(scaleX, scaleY),
              originX: 'center',
              originY: 'center',
              selectable: editable,
              angle: angle || 0,
            });
            (rect as any).customData = { id };
            canvas.add(rect);
          } else if (props.shape === 'circle') {
            const circle = new Circle({
              left: position.x * scaleX,
              top: position.y * scaleY,
              radius: (size.width / 2) * Math.min(scaleX, scaleY),
              fill: props.fill || '#000000',
              stroke: props.stroke || '',
              strokeWidth: (props.strokeWidth || 0) * Math.min(scaleX, scaleY),
              originX: 'center',
              originY: 'center',
              selectable: editable,
              angle: angle || 0,
            });
            (circle as any).customData = { id };
            canvas.add(circle);
          }
          break;
          
        case 'image':
          Image.fromURL(props.src, {
            crossOrigin: 'anonymous',
          }).then((img) => {
            img.set({
              left: position.x * scaleX,
              top: position.y * scaleY,
              scaleX: (size.width / (img.width || 1)) * scaleX,
              scaleY: (size.height / (img.height || 1)) * scaleY,
              originX: 'center',
              originY: 'center',
              selectable: editable,
              angle: angle || 0,
            });
            (img as any).customData = { id };
            canvas.add(img);
            canvas.renderAll();
          }).catch(err => {
            console.error('Image loading failed:', err);
          });
          break;
      }
    });
    
    canvas.renderAll();
    console.log(`Rendered ${elements.length} elements for slide ${currentSlide}`);
    
  } catch (err) {
    console.error('Element rendering failed:', err);
    throw new Error('要素の描画に失敗しました');
  }
};
