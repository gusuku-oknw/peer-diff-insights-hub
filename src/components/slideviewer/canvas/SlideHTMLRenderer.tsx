
import React from 'react';

interface SlideHTMLRendererProps {
  html: string;
  width: number;
  height: number;
  zoomLevel?: number;
}

const SlideHTMLRenderer: React.FC<SlideHTMLRendererProps> = ({
  html,
  width,
  height,
  zoomLevel = 100
}) => {
  const scale = zoomLevel / 100;
  
  return (
    <div
      className="slide-html-content overflow-hidden pointer-events-none"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        position: 'relative',
        background: 'transparent'
      }}
    >
      <div 
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          background: 'white',
          overflow: 'hidden'
        }}
      />
    </div>
  );
};

export default SlideHTMLRenderer;
