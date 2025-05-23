
import { useEffect, useRef, useState, useCallback, memo } from "react";
import { useSlideStore } from "@/stores/slideStore";
import { useAuth } from "@/contexts/AuthContext";
import useFabricCanvas from "@/hooks/useFabricCanvas";
import {
  createTextElement,
  createRectElement,
  createCircleElement,
  addCustomDataToObject,
} from "@/components/slideviewer/editor/FabricObjects";
import AddElementButtons from "@/components/slideviewer/editor/AddElementButtons";
import EditModeIndicator from "@/components/slideviewer/editor/EditModeIndicator";
import * as fabric from 'fabric';

interface FabricSlideCanvasProps {
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
  userType?: "student" | "enterprise";
}

const FabricSlideCanvas = ({ 
  currentSlide, 
  zoomLevel = 100, 
  editable = false,
  userType = "enterprise" 
}: FabricSlideCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { userProfile } = useAuth();
  const slides = useSlideStore(state => state.slides);
  const addElement = useSlideStore(state => state.addElement);
  const updateElement = useSlideStore(state => state.updateElement);
  const [canvasReady, setCanvasReady] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const renderAttemptRef = useRef(0);

  // Use our custom hook for canvas management
  const { canvas, initialized } = useFabricCanvas({
    canvasRef,
    currentSlide,
    zoomLevel,
    editable,
    onUpdateElement: (elementId, updates) => {
      updateElement(currentSlide, elementId, updates);
    }
  });

  // Mark canvas as ready when initialized
  useEffect(() => {
    if (initialized && canvas) {
      setCanvasReady(true);
      setLoadingError(null);
    }
  }, [initialized, canvas]);

  // Clean function to safely access slide data
  const getCurrentSlideData = useCallback(() => {
    return slides.find(slide => slide.id === currentSlide);
  }, [slides, currentSlide]);

  // Load slide content when current slide changes or canvas is initialized
  useEffect(() => {
    if (!canvas || !initialized || !canvasReady) return;

    const maxRenderAttempts = 3;
    renderAttemptRef.current += 1;

    console.log("Loading slide content for slide", currentSlide);
    
    try {
      // Use a try-catch to handle any rendering errors
      // Clear canvas
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      canvas.renderAll();

      // Get current slide data
      const slideData = getCurrentSlideData();
      if (!slideData) {
        console.log("No slide data found for slide", currentSlide);
        return;
      }

      // If the slide has elements, add them to the canvas
      if (slideData.elements && slideData.elements.length > 0) {
        slideData.elements.forEach(element => {
          let fabricObject;

          switch (element.type) {
            case 'text':
              fabricObject = createTextElement(
                element.props.text || "New Text",
                element.position.x,
                element.position.y,
                {
                  width: element.size.width,
                  fontSize: element.props.fontSize || 24,
                  fill: element.props.color || '#000000',
                  fontFamily: element.props.fontFamily || 'Arial',
                  fontWeight: element.props.fontWeight || 'normal',
                  angle: element.angle,
                  selectable: editable,
                }
              );
              break;
              
            case 'shape':
              if (element.props.shape === 'rect') {
                fabricObject = createRectElement(
                  element.position.x,
                  element.position.y,
                  element.size.width,
                  element.size.height,
                  {
                    fill: element.props.fill || '#000000',
                    stroke: element.props.stroke || '',
                    strokeWidth: element.props.strokeWidth || 0,
                    angle: element.angle,
                    selectable: editable,
                  }
                );
              } else if (element.props.shape === 'circle') {
                fabricObject = createCircleElement(
                  element.position.x,
                  element.position.y,
                  element.size.width / 2,
                  {
                    fill: element.props.fill || '#000000',
                    stroke: element.props.stroke || '',
                    strokeWidth: element.props.strokeWidth || 0,
                    angle: element.angle,
                    selectable: editable,
                  }
                );
              }
              break;
              
            case 'image':
              // Using the Promise-based API for Fabric.js v6
              fabric.Image.fromURL(
                element.props.src, 
                { crossOrigin: 'anonymous' }
              ).then((img) => {
                if (!canvas || !canvasReady) return; // Safety check before adding to canvas

                img.set({
                  left: element.position.x,
                  top: element.position.y,
                  scaleX: element.size.width / img.width! || 1,
                  scaleY: element.size.height / img.height! || 1,
                  angle: element.angle,
                  selectable: editable,
                  originX: 'center',
                  originY: 'center',
                });
                
                // Add custom data
                addCustomDataToObject(img, element.id);
                
                canvas.add(img);
                canvas.renderAll();
              }).catch(error => console.error("Error loading image:", error));
              break;
          }

          if (fabricObject) {
            // Add custom data for tracking
            addCustomDataToObject(fabricObject, element.id);
            canvas.add(fabricObject);
          }
        });
      } else {
        // If there are no elements, use a placeholder text
        const slideNumberText = new fabric.Text(`スライド ${currentSlide}`, {
          left: canvas.width! / 2,
          top: canvas.height! / 2,
          fontSize: 36,
          fill: '#1e293b',
          originX: 'center',
          originY: 'center',
          selectable: false,
        });
        canvas.add(slideNumberText);
      }

      canvas.renderAll();
      
      // Reset the render attempt counter on success
      renderAttemptRef.current = 0;
      setLoadingError(null);
    } catch (error) {
      console.error("Error rendering slide:", error);
      
      // Set error state if max render attempts exceeded
      if (renderAttemptRef.current >= maxRenderAttempts) {
        setLoadingError("スライドの読み込み中にエラーが発生しました");
      }
    }
  }, [currentSlide, initialized, canvasReady, canvas, getCurrentSlideData, editable]);

  // Add a new text element in edit mode - memoized to improve performance
  const handleAddTextElement = useCallback(() => {
    if (!editable || !canvas || !canvasReady) return;
    
    const newId = `text-${Date.now()}`;
    const newText = createTextElement(
      "テキストをクリックして編集", 
      canvas.width! / 2, 
      canvas.height! / 2,
      {
        selectable: true,
        editable: true,
      }
    );
    
    // Add custom data
    addCustomDataToObject(newText, newId);
    
    canvas.add(newText);
    canvas.setActiveObject(newText);
    canvas.renderAll();
    
    // Add to store
    addElement(currentSlide, {
      id: newId,
      type: 'text',
      props: { 
        text: "テキストをクリックして編集",
        fontSize: 24,
        color: '#000000',
      },
      position: { 
        x: canvas.width! / 2, 
        y: canvas.height! / 2 
      },
      size: { 
        width: newText.width!, 
        height: newText.height! 
      },
      angle: 0,
      zIndex: 1,
    });
  }, [editable, canvas, canvasReady, addElement, currentSlide]);

  const handleAddRectElement = useCallback(() => {
    if (!editable || !canvas) return;
    
    const newId = `rect-${Date.now()}`;
    const newRect = createRectElement(
      canvas.width! / 2, 
      canvas.height! / 2
    );
    
    // Add custom data
    addCustomDataToObject(newRect, newId);
    
    canvas.add(newRect);
    canvas.setActiveObject(newRect);
    canvas.renderAll();
    
    // Add to store
    addElement(currentSlide, {
      id: newId,
      type: 'shape',
      props: { 
        shape: 'rect',
        fill: '#4287f5',
        stroke: '#2054a8',
        strokeWidth: 2,
      },
      position: { 
        x: canvas.width! / 2, 
        y: canvas.height! / 2 
      },
      size: { 
        width: 150, 
        height: 100 
      },
      angle: 0,
      zIndex: 1,
    });
  }, [editable, canvas, addElement, currentSlide]);

  const handleAddCircleElement = useCallback(() => {
    if (!editable || !canvas) return;
    
    const newId = `circle-${Date.now()}`;
    const newCircle = createCircleElement(
      canvas.width! / 2, 
      canvas.height! / 2
    );
    
    // Add custom data
    addCustomDataToObject(newCircle, newId);
    
    canvas.add(newCircle);
    canvas.setActiveObject(newCircle);
    canvas.renderAll();
    
    // Add to store
    addElement(currentSlide, {
      id: newId,
      type: 'shape',
      props: { 
        shape: 'circle',
        fill: '#f54242',
        stroke: '#8a2727',
        strokeWidth: 2,
      },
      position: { 
        x: canvas.width! / 2, 
        y: canvas.height! / 2 
      },
      size: { 
        width: 100, 
        height: 100 
      },
      angle: 0,
      zIndex: 1,
    });
  }, [editable, canvas, addElement, currentSlide]);

  // Improved container style with CSS scaling instead of dimension changes
  const containerStyle = {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '1200px',
    aspectRatio: '16 / 9',
    display: 'flex',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    overflow: 'hidden' as const,
  };

  // Canvas wrapper style with CSS transform for zoom
  const canvasWrapperStyle = {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    transformOrigin: 'center center',
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="relative w-full aspect-video bg-gray-100 overflow-hidden flex justify-center items-center p-2"
      >
        <div style={containerStyle} className="drop-shadow-xl">
          <div style={canvasWrapperStyle}>
            <canvas ref={canvasRef} />
            
            {/* Editable mode overlay message */}
            {editable && <EditModeIndicator />}

            {/* Edit toolbar for adding elements */}
            {editable && canvasReady && (
              <AddElementButtons 
                onAddText={handleAddTextElement}
                onAddRect={handleAddRectElement}
                onAddCircle={handleAddCircleElement}
              />
            )}
            
            {/* Loading indicator */}
            {!canvasReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-blue-600 font-medium">キャンバスを読み込み中...</p>
                </div>
              </div>
            )}
            
            {/* Error message */}
            {loadingError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-75">
                <div className="flex flex-col items-center">
                  <p className="mt-4 text-red-600 font-medium">{loadingError}</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    onClick={() => window.location.reload()}
                  >
                    再読み込み
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// メモ化してパフォーマンス改善
export default memo(FabricSlideCanvas);
