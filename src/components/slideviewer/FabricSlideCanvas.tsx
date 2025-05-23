import { useEffect, useRef, useState } from "react";
import * as fabric from 'fabric'; // The correct import
import { useSlideStore } from "@/stores/slideStore";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface FabricSlideCanvasProps {
  currentSlide: number;
  zoomLevel?: number;
  editable?: boolean;
  userType?: "student" | "enterprise";
}

// Define type for custom properties we want to add to fabric objects
interface CustomFabricObject extends fabric.Object {
  customData?: {
    id: string;
  };
}

const FabricSlideCanvas = ({ 
  currentSlide, 
  zoomLevel = 100, 
  editable = false,
  userType = "enterprise" 
}: FabricSlideCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const { userProfile } = useAuth();
  const slides = useSlideStore(state => state.slides);
  const addElement = useSlideStore(state => state.addElement);
  const updateElement = useSlideStore(state => state.updateElement);
  const [canvasInitialized, setCanvasInitialized] = useState(false);

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: '#ffffff',
      width: 1600,
      height: 900,
      selection: editable, // Allow selection only in editable mode
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;
    setCanvasInitialized(true);

    // Clean up
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [editable]);

  // Apply the zoom level
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const scaleFactor = zoomLevel / 100;
    canvas.setZoom(scaleFactor);
    canvas.setDimensions({
      width: canvas.getWidth() * scaleFactor,
      height: canvas.getHeight() * scaleFactor,
    });
  }, [zoomLevel]);

  // Load slide content when current slide changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canvasInitialized) return;

    // Clear canvas
    canvas.clear();
    // Update background color instead of using setBackgroundColor
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();

    // Get current slide data
    const slideData = slides.find(slide => slide.id === currentSlide);
    if (!slideData) return;

    // If the slide has elements, add them to the canvas
    if (slideData.elements && slideData.elements.length > 0) {
      slideData.elements.forEach(element => {
        let fabricObject;

        switch (element.type) {
          case 'text':
            fabricObject = new fabric.Text(element.props.text || "New Text", {
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              fontSize: element.props.fontSize || 24,
              fill: element.props.color || '#000000',
              fontFamily: element.props.fontFamily || 'Arial',
              angle: element.angle,
              selectable: editable,
            }) as CustomFabricObject;
            
            // Add custom data
            fabricObject.customData = { id: element.id };
            break;
            
          case 'shape':
            if (element.props.shape === 'rect') {
              fabricObject = new fabric.Rect({
                left: element.position.x,
                top: element.position.y,
                width: element.size.width,
                height: element.size.height,
                fill: element.props.fill || '#000000',
                stroke: element.props.stroke || '',
                strokeWidth: element.props.strokeWidth || 0,
                angle: element.angle,
                selectable: editable,
              }) as CustomFabricObject;
              
              // Add custom data
              fabricObject.customData = { id: element.id };
            } else if (element.props.shape === 'circle') {
              fabricObject = new fabric.Circle({
                left: element.position.x,
                top: element.position.y,
                radius: element.size.width / 2,
                fill: element.props.fill || '#000000',
                stroke: element.props.stroke || '',
                strokeWidth: element.props.strokeWidth || 0,
                angle: element.angle,
                selectable: editable,
              }) as CustomFabricObject;
              
              // Add custom data
              fabricObject.customData = { id: element.id };
            }
            break;
            
          case 'image':
            // Fixed the image loading API to match Fabric.js v6
            fabric.Image.fromURL(
              element.props.src, 
              { crossOrigin: 'anonymous' }
            ).then((img) => {
              (img as CustomFabricObject).set({
                left: element.position.x,
                top: element.position.y,
                scaleX: element.size.width / img.width! || 1,
                scaleY: element.size.height / img.height! || 1,
                angle: element.angle,
                selectable: editable,
              });
              
              // Add custom data
              (img as CustomFabricObject).customData = { id: element.id };
              
              canvas.add(img);
              canvas.renderAll();
            }).catch(error => console.error("Error loading image:", error));
            break;
        }

        if (fabricObject) {
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

    // Set up fabric object modification events when editable
    if (editable) {
      canvas.on('object:modified', (e) => {
        const modifiedObject = e.target as CustomFabricObject;
        if (!modifiedObject) return;
        
        // Update the object in our store using customData instead of data
        updateElement(
          currentSlide,
          modifiedObject.customData?.id || 'temp-id',
          {
            position: { 
              x: modifiedObject.left || 0, 
              y: modifiedObject.top || 0 
            },
            size: { 
              width: modifiedObject.width! * (modifiedObject.scaleX || 1), 
              height: modifiedObject.height! * (modifiedObject.scaleY || 1) 
            },
            angle: modifiedObject.angle || 0,
            // We would also update props based on type here
          }
        );
      });
    }

    canvas.renderAll();
  }, [currentSlide, canvasInitialized, slides, editable, updateElement]);

  // Add a new element in edit mode
  const handleAddTextElement = () => {
    if (!editable || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const newText = new fabric.IText("テキストをクリックして編集", {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      fontSize: 24,
      fill: '#000000',
      originX: 'center',
      originY: 'center',
      selectable: true,
      editable: true,
    }) as fabric.IText & CustomFabricObject;
    
    const newId = `text-${Date.now()}`;
    // Use customData instead of data
    newText.customData = { id: newId };
    
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
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className={`relative w-full aspect-video bg-gray-100 overflow-hidden`}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0.5rem"
        }}
      >
        <div 
          style={{
            transformOrigin: "center center",
            transition: "transform 0.3s ease-in-out",
            width: "100%",
            maxWidth: "1200px",
            position: "relative"
          }}
          className="drop-shadow-xl"
        >
          <canvas ref={canvasRef} className="max-w-full" />
          
          {/* Editable mode overlay message */}
          {editable && (
            <div className="absolute bottom-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-1">
              <Pencil className="h-3 w-3" />
              編集モード
            </div>
          )}

          {/* Edit toolbar for adding elements */}
          {editable && (
            <div className="absolute top-2 left-2 bg-white p-2 rounded-md shadow-lg flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleAddTextElement}
                className="bg-white"
              >
                テキスト追加
              </Button>
              {/* Other tools can be added here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FabricSlideCanvas;
