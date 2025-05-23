
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Type, 
  Square, 
  Circle, 
  Image, 
  Palette, 
  PanelLeftClose,
  Layers,
  Settings,
  AlignCenter,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  ArrowBigUp,
  ArrowBigDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSlideStore } from "@/stores/slideStore";
import ColorPicker from "@/components/slideviewer/editor/ColorPicker";

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
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Settings className="h-4 w-4" />
                要素追加
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={handleAddText}
                >
                  <Type className="h-6 w-6 mb-1 text-blue-600" />
                  <span className="text-xs">テキスト</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => handleAddShape('rect')}
                >
                  <Square className="h-6 w-6 mb-1 text-blue-600" />
                  <span className="text-xs">四角形</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => handleAddShape('circle')}
                >
                  <Circle className="h-6 w-6 mb-1 text-blue-600" />
                  <span className="text-xs">円形</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={handleAddImage}
                >
                  <Image className="h-6 w-6 mb-1 text-blue-600" />
                  <span className="text-xs">画像</span>
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1 mt-6">
                <Layers className="h-4 w-4" />
                要素一覧
              </h3>
              
              {elements.length === 0 ? (
                <div className="text-sm text-gray-500 p-4 text-center bg-gray-50 rounded-lg">
                  要素がありません
                </div>
              ) : (
                <div className="space-y-2 mt-2">
                  {elements.map((element) => (
                    <Button 
                      key={element.id} 
                      variant="outline" 
                      className={`w-full justify-start gap-2 ${
                        selectedElement?.id === element.id ? 'bg-blue-50 border-blue-300' : ''
                      }`}
                      onClick={() => handleElementSelect(element)}
                    >
                      {element.type === 'text' ? (
                        <Type className="h-4 w-4" />
                      ) : element.type === 'shape' && element.props.shape === 'rect' ? (
                        <Square className="h-4 w-4" />
                      ) : element.type === 'shape' && element.props.shape === 'circle' ? (
                        <Circle className="h-4 w-4" />
                      ) : element.type === 'image' ? (
                        <Image className="h-4 w-4" />
                      ) : (
                        <div className="h-4 w-4" />
                      )}
                      <span className="text-xs truncate">
                        {element.type === 'text' 
                          ? (element.props.text || '').substring(0, 20) + (element.props.text?.length > 20 ? '...' : '') 
                          : element.type === 'shape' 
                          ? `${element.props.shape === 'rect' ? '四角形' : '円形'} ${element.id.split('-')[1]}` 
                          : `画像 ${element.id.split('-')[1]}`}
                      </span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {/* プロパティタブ */}
        <TabsContent value="properties" className="flex-grow p-0 mt-0">
          <ScrollArea className="h-full">
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
                      <>
                        <AccordionItem value="text-content">
                          <AccordionTrigger className="text-sm py-2">テキスト内容</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              <div className="grid w-full gap-1.5">
                                <Label htmlFor="text" className="text-xs">テキスト</Label>
                                <Input 
                                  id="text" 
                                  value={selectedElement.props.text || ''}
                                  onChange={handleTextValueChange}
                                  className="h-20"
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="text-style">
                          <AccordionTrigger className="text-sm py-2">テキストスタイル</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              <div className="grid w-full gap-1.5">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor="font-size" className="text-xs">フォントサイズ</Label>
                                  <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                    {selectedElement.props.fontSize || 24}px
                                  </span>
                                </div>
                                <Slider 
                                  id="font-size"
                                  value={[selectedElement.props.fontSize || 24]}
                                  min={8}
                                  max={72}
                                  step={1}
                                  onValueChange={handleFontSizeChange}
                                  className="py-1"
                                />
                              </div>
                              
                              <div className="grid w-full gap-1.5">
                                <Label htmlFor="font-family" className="text-xs">フォント</Label>
                                <Select 
                                  value={selectedElement.props.fontFamily || 'Arial'} 
                                  onValueChange={handleFontFamilyChange}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="フォントを選択" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Arial">Arial</SelectItem>
                                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                    <SelectItem value="Courier New">Courier New</SelectItem>
                                    <SelectItem value="Georgia">Georgia</SelectItem>
                                    <SelectItem value="Verdana">Verdana</SelectItem>
                                    <SelectItem value="Impact">Impact</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="grid w-full gap-1.5">
                                <Label className="text-xs">テキスト色</Label>
                                <ColorPicker 
                                  color={selectedElement.props.color || '#000000'}
                                  onChange={handleTextColorChange}
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </>
                    )}
                    
                    {/* 図形要素のプロパティ */}
                    {selectedElement.type === 'shape' && (
                      <AccordionItem value="shape-style">
                        <AccordionTrigger className="text-sm py-2">図形スタイル</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            <div className="grid w-full gap-1.5">
                              <Label className="text-xs">塗りつぶし色</Label>
                              <ColorPicker 
                                color={selectedElement.props.fill || '#4287f5'}
                                onChange={handleShapeFillChange}
                              />
                            </div>
                            
                            <div className="grid w-full gap-1.5">
                              <Label className="text-xs">枠線色</Label>
                              <ColorPicker 
                                color={selectedElement.props.stroke || '#2054a8'}
                                onChange={handleShapeStrokeChange}
                              />
                            </div>
                            
                            <div className="grid w-full gap-1.5">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="stroke-width" className="text-xs">枠線の太さ</Label>
                                <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                  {selectedElement.props.strokeWidth || 0}px
                                </span>
                              </div>
                              <Slider 
                                id="stroke-width"
                                value={[selectedElement.props.strokeWidth || 0]}
                                min={0}
                                max={20}
                                step={1}
                                onValueChange={handleStrokeWidthChange}
                                className="py-1"
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                    
                    {/* 画像要素のプロパティ */}
                    {selectedElement.type === 'image' && (
                      <AccordionItem value="image-properties">
                        <AccordionTrigger className="text-sm py-2">画像プロパティ</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            <div className="grid w-full items-center gap-1.5">
                              <Label htmlFor="alt-text" className="text-xs">代替テキスト</Label>
                              <Input 
                                id="alt-text" 
                                value={selectedElement.props.alt || ''}
                                onChange={(e) => handleUpdateElement(selectedElement.id, {
                                  props: {
                                    ...selectedElement.props,
                                    alt: e.target.value
                                  }
                                })}
                              />
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="keep-aspect-ratio" 
                                checked={true}
                                // onCheckedChange={...} 
                                // 実装はまだ
                              />
                              <Label htmlFor="keep-aspect-ratio" className="text-xs">アスペクト比を維持</Label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                    
                    {/* 共通の位置・サイズプロパティ */}
                    <AccordionItem value="position-size">
                      <AccordionTrigger className="text-sm py-2">位置とサイズ</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label htmlFor="position-x" className="text-xs">X位置</Label>
                              <Input 
                                id="position-x" 
                                type="number"
                                value={Math.round(selectedElement.position.x)}
                                onChange={(e) => handlePositionChange('x', Number(e.target.value))}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="position-y" className="text-xs">Y位置</Label>
                              <Input 
                                id="position-y" 
                                type="number"
                                value={Math.round(selectedElement.position.y)}
                                onChange={(e) => handlePositionChange('y', Number(e.target.value))}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="size-width" className="text-xs">幅</Label>
                              <Input 
                                id="size-width" 
                                type="number"
                                value={Math.round(selectedElement.size.width)}
                                onChange={(e) => handleSizeChange('width', Number(e.target.value))}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="size-height" className="text-xs">高さ</Label>
                              <Input 
                                id="size-height" 
                                type="number"
                                value={Math.round(selectedElement.size.height)}
                                onChange={(e) => handleSizeChange('height', Number(e.target.value))}
                                disabled={selectedElement.type === 'shape' && selectedElement.props.shape === 'circle'}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="angle" className="text-xs">回転角度</Label>
                              <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                {Math.round(selectedElement.angle || 0)}°
                              </span>
                            </div>
                            <Slider 
                              id="angle"
                              value={[selectedElement.angle || 0]}
                              min={0}
                              max={360}
                              step={1}
                              onValueChange={handleAngleChange}
                              className="py-1"
                            />
                          </div>
                          
                          <Separator className="my-2" />
                          
                          <div className="flex justify-between gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8"
                              onClick={handleAlignCenter}
                            >
                              <AlignCenter className="h-3 w-3 mr-1" />
                              <span className="text-xs">水平中央</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8"
                              onClick={handleAlignMiddle}
                            >
                              <AlignVerticalJustifyCenter className="h-3 w-3 mr-1" />
                              <span className="text-xs">垂直中央</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8"
                              onClick={handleAlignBoth}
                            >
                              <AlignHorizontalJustifyCenter className="h-3 w-3 mr-1" />
                              <span className="text-xs">中央揃え</span>
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {/* レイヤータブ */}
        <TabsContent value="layers" className="flex-grow p-0 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Layers className="h-4 w-4" />
                レイヤー管理
              </h3>
              
              {elements.length === 0 ? (
                <div className="text-sm text-gray-500 p-4 text-center bg-gray-50 rounded-lg mt-3">
                  このスライドには要素がありません
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  {/* Sort by zIndex for layer display */}
                  {[...elements]
                    .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
                    .map((element, index) => (
                      <div 
                        key={element.id} 
                        className={`
                          p-2 border rounded-md cursor-pointer flex items-center gap-2
                          ${selectedElement?.id === element.id ? 'bg-blue-50 border-blue-300' : 'border-gray-200'}
                        `}
                        onClick={() => handleElementSelect(element)}
                      >
                        <div className="bg-gray-200 text-gray-600 w-5 h-5 rounded-full flex items-center justify-center text-xs">
                          {elements.length - index}
                        </div>
                        
                        {element.type === 'text' ? (
                          <Type className="h-4 w-4" />
                        ) : element.type === 'shape' && element.props.shape === 'rect' ? (
                          <Square className="h-4 w-4" />
                        ) : element.type === 'shape' && element.props.shape === 'circle' ? (
                          <Circle className="h-4 w-4" />
                        ) : element.type === 'image' ? (
                          <Image className="h-4 w-4" />
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                        
                        <span className="text-xs truncate flex-grow">
                          {element.type === 'text' 
                            ? (element.props.text || '').substring(0, 15) + (element.props.text?.length > 15 ? '...' : '') 
                            : element.type === 'shape' 
                            ? `${element.props.shape === 'rect' ? '四角形' : '円形'} ${element.id.split('-')[1]}` 
                            : `画像 ${element.id.split('-')[1]}`}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ArrowBigUp className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ArrowBigDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditSidebar;
