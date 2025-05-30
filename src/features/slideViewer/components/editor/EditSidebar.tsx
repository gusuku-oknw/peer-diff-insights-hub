
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, Type, Square, Circle, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSlideStore } from "@/stores/slideStore";

import ElementsPanel from "./sidebar/ElementsPanel";
import TextPropertiesPanel from "./sidebar/TextPropertiesPanel";
import ShapePropertiesPanel from "./sidebar/ShapePropertiesPanel";
import PositionSizePanel from "./sidebar/PositionSizePanel";
import LayersPanel from "./sidebar/LayersPanel";

interface EditSidebarProps {
  currentSlide: number;
}

const EditSidebar = ({ currentSlide }: EditSidebarProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("elements");
  const slides = useSlideStore(state => state.slides);
  const addElement = useSlideStore(state => state.addElement);
  const updateElement = useSlideStore(state => state.updateElement);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  
  // Get current slide data
  const currentSlideData = slides.find(slide => slide.id === currentSlide);
  const elements = currentSlideData?.elements || [];
  
  const handleAddText = () => {
    const newId = `text-${Date.now()}`;
    
    addElement(currentSlide, {
      id: newId,
      type: 'text',
      props: { 
        text: "テキストをクリックして編集",
        fontSize: 24,
        color: '#000000',
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'left'
      },
      position: { x: 800, y: 450 },
      size: { width: 250, height: 50 },
      angle: 0,
      zIndex: Date.now()
    });
    
    toast({ title: "テキスト要素を追加しました" });
  };
  
  const handleAddShape = (type: 'rect' | 'circle') => {
    const newId = `${type}-${Date.now()}`;
    
    addElement(currentSlide, {
      id: newId,
      type: 'shape',
      props: { 
        shape: type,
        fill: type === 'rect' ? '#4287f5' : '#f54242',
        stroke: type === 'rect' ? '#2054a8' : '#8a2727',
        strokeWidth: 2
      },
      position: { x: 800, y: 450 },
      size: { width: type === 'rect' ? 150 : 100, height: type === 'rect' ? 100 : 100 },
      angle: 0,
      zIndex: Date.now()
    });
    
    toast({ title: type === 'rect' ? "四角形を追加しました" : "円形を追加しました" });
  };
  
  const handleAddImage = () => {
    toast({ 
      title: "画像追加機能は開発中です", 
      description: "この機能は近日公開予定です"
    });
  };
  
  const handleElementSelect = (element: any) => {
    setSelectedElement(element);
    setActiveTab("properties");
  };
  
  const handleUpdateElement = (elementId: string, updates: any) => {
    updateElement(currentSlide, elementId, updates);
    
    // If we're updating the currently selected element, update the local state too
    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement({
        ...selectedElement,
        ...updates
      });
    }
  };
  
  const handleTextValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedElement || selectedElement.type !== 'text') return;
    
    handleUpdateElement(selectedElement.id, {
      props: {
        ...selectedElement.props,
        text: e.target.value
      }
    });
  };
  
  const handleFontSizeChange = (value: number[]) => {
    if (!selectedElement || selectedElement.type !== 'text') return;
    
    handleUpdateElement(selectedElement.id, {
      props: {
        ...selectedElement.props,
        fontSize: value[0]
      }
    });
  };
  
  const handleFontFamilyChange = (value: string) => {
    if (!selectedElement || selectedElement.type !== 'text') return;
    
    handleUpdateElement(selectedElement.id, {
      props: {
        ...selectedElement.props,
        fontFamily: value
      }
    });
  };
  
  const handleTextColorChange = (color: string) => {
    if (!selectedElement || selectedElement.type !== 'text') return;
    
    handleUpdateElement(selectedElement.id, {
      props: {
        ...selectedElement.props,
        color
      }
    });
  };
  
  const handleShapeFillChange = (color: string) => {
    if (!selectedElement || selectedElement.type !== 'shape') return;
    
    handleUpdateElement(selectedElement.id, {
      props: {
        ...selectedElement.props,
        fill: color
      }
    });
  };
  
  const handleShapeStrokeChange = (color: string) => {
    if (!selectedElement || selectedElement.type !== 'shape') return;
    
    handleUpdateElement(selectedElement.id, {
      props: {
        ...selectedElement.props,
        stroke: color
      }
    });
  };
  
  const handleStrokeWidthChange = (value: number[]) => {
    if (!selectedElement || selectedElement.type !== 'shape') return;
    
    handleUpdateElement(selectedElement.id, {
      props: {
        ...selectedElement.props,
        strokeWidth: value[0]
      }
    });
  };
  
  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    if (!selectedElement) return;
    
    handleUpdateElement(selectedElement.id, {
      position: {
        ...selectedElement.position,
        [axis]: value
      }
    });
  };
  
  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    if (!selectedElement) return;
    
    handleUpdateElement(selectedElement.id, {
      size: {
        ...selectedElement.size,
        [dimension]: value
      }
    });
  };
  
  const handleAngleChange = (value: number[]) => {
    if (!selectedElement) return;
    
    handleUpdateElement(selectedElement.id, {
      angle: value[0]
    });
  };
  
  const handleAlignCenter = () => {
    if (!selectedElement) return;
    
    // Align to center of slide (800, 450 for 1600x900)
    handleUpdateElement(selectedElement.id, {
      position: {
        ...selectedElement.position,
        x: 800
      }
    });
    
    toast({ title: "水平方向に中央揃えしました" });
  };
  
  const handleAlignMiddle = () => {
    if (!selectedElement) return;
    
    handleUpdateElement(selectedElement.id, {
      position: {
        ...selectedElement.position,
        y: 450
      }
    });
    
    toast({ title: "垂直方向に中央揃えしました" });
  };
  
  const handleAlignBoth = () => {
    if (!selectedElement) return;
    
    handleUpdateElement(selectedElement.id, {
      position: {
        x: 800,
        y: 450
      }
    });
    
    toast({ title: "中央に配置しました" });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
        <h2 className="text-sm font-medium text-blue-900">編集パネル</h2>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <PanelLeftClose className="h-4 w-4 text-blue-700" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-gray-50">
          <TabsTrigger value="elements" className="text-xs py-1">
            要素
          </TabsTrigger>
          <TabsTrigger value="properties" className="text-xs py-1">
            プロパティ
          </TabsTrigger>
          <TabsTrigger value="layers" className="text-xs py-1">
            レイヤー
          </TabsTrigger>
        </TabsList>
        
        {/* 要素タブ */}
        <TabsContent value="elements" className="flex-grow p-0 mt-0">
          <ElementsPanel 
            elements={elements}
            onAddText={handleAddText}
            onAddShape={handleAddShape}
            onAddImage={handleAddImage}
            onElementSelect={handleElementSelect}
            selectedElement={selectedElement}
          />
        </TabsContent>
        
        {/* プロパティタブ */}
        <TabsContent value="properties" className="flex-grow p-0 mt-0">
          <div className="p-4">
            {!selectedElement ? (
              <div className="text-sm text-gray-500 p-4 text-center bg-gray-50 rounded-lg">
                編集する要素を選択してください
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  {selectedElement.type === 'text' ? (
                    <Type className="h-4 w-4" />
                  ) : selectedElement.type === 'shape' ? (
                    selectedElement.props.shape === 'rect' ? (
                      <Square className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )
                  ) : (
                    <Image className="h-4 w-4" />
                  )}
                  {selectedElement.type === 'text' 
                    ? 'テキスト編集' 
                    : selectedElement.type === 'shape' 
                      ? `図形編集 (${selectedElement.props.shape === 'rect' ? '四角形' : '円形'})` 
                      : '画像編集'}
                </h3>
                
                <Accordion type="single" collapsible className="w-full">
                  {/* テキスト要素のプロパティ */}
                  {selectedElement.type === 'text' && (
                    <TextPropertiesPanel
                      element={selectedElement}
                      onTextValueChange={handleTextValueChange}
                      onFontSizeChange={handleFontSizeChange}
                      onFontFamilyChange={handleFontFamilyChange}
                      onTextColorChange={handleTextColorChange}
                    />
                  )}
                  
                  {/* 図形要素のプロパティ */}
                  {selectedElement.type === 'shape' && (
                    <ShapePropertiesPanel
                      element={selectedElement}
                      onFillColorChange={handleShapeFillChange}
                      onStrokeColorChange={handleShapeStrokeChange}
                      onStrokeWidthChange={handleStrokeWidthChange}
                    />
                  )}
                  
                  {/* 共通の位置・サイズプロパティ */}
                  <PositionSizePanel 
                    element={selectedElement}
                    onPositionChange={handlePositionChange}
                    onSizeChange={handleSizeChange}
                    onAngleChange={handleAngleChange}
                    onAlignCenter={handleAlignCenter}
                    onAlignMiddle={handleAlignMiddle}
                    onAlignBoth={handleAlignBoth}
                  />
                </Accordion>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* レイヤータブ */}
        <TabsContent value="layers" className="flex-grow p-0 mt-0">
          <LayersPanel
            elements={elements}
            onElementSelect={handleElementSelect}
            selectedElement={selectedElement}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditSidebar;
