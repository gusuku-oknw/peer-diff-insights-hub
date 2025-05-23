
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSlideStore } from "@/stores/slideStore";
import { useToast } from "@/hooks/use-toast";
import { 
  Sidebar, 
  Undo, 
  Redo, 
  Copy, 
  Trash, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Bold, 
  Italic, 
  Underline,
  Type,
  Square,
  Circle,
  Image,
  Group,
  Ungroup,
  LockKeyhole,
  Unlock,
  ArrowBigDown,
  ArrowBigUp,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EditToolbarProps {
  currentSlide: number;
  toggleSidebar: () => void;
}

export default function EditToolbar({ currentSlide, toggleSidebar }: EditToolbarProps) {
  const [activeTab, setActiveTab] = useState("insert");
  const [textFormatting, setTextFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: "left"
  });
  
  const { toast } = useToast();
  const addElement = useSlideStore(state => state.addElement);
  const setZoom = useSlideStore(state => state.setZoom);
  const zoom = useSlideStore(state => state.zoom);
  
  const handleAddText = () => {
    addElement(currentSlide, {
      id: `text-${Date.now()}`,
      type: 'text',
      props: { 
        text: "テキストをクリックして編集",
        fontSize: 24,
        color: '#000000',
        fontFamily: 'Arial'
      },
      position: { x: 800, y: 450 },
      size: { width: 250, height: 50 },
      angle: 0,
      zIndex: Date.now()
    });
    toast({ title: "テキスト要素を追加しました" });
  };
  
  const handleAddRect = () => {
    addElement(currentSlide, {
      id: `rect-${Date.now()}`,
      type: 'shape',
      props: { 
        shape: 'rect',
        fill: '#4287f5',
        stroke: '#2054a8',
        strokeWidth: 2
      },
      position: { x: 800, y: 450 },
      size: { width: 150, height: 100 },
      angle: 0,
      zIndex: Date.now()
    });
    toast({ title: "四角形を追加しました" });
  };
  
  const handleAddCircle = () => {
    addElement(currentSlide, {
      id: `circle-${Date.now()}`,
      type: 'shape',
      props: { 
        shape: 'circle',
        fill: '#f54242',
        stroke: '#8a2727',
        strokeWidth: 2
      },
      position: { x: 800, y: 450 },
      size: { width: 100, height: 100 },
      angle: 0,
      zIndex: Date.now()
    });
    toast({ title: "円形を追加しました" });
  };
  
  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(zoom + 10);
    }
  };
  
  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(zoom - 10);
    }
  };
  
  const handleNotImplemented = (feature: string) => {
    toast({ 
      title: `${feature}は開発中です`, 
      description: "この機能は近日公開予定です" 
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 py-1 px-2 flex flex-col gap-1">
      {/* Upper toolbar with common actions */}
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={toggleSidebar}
              >
                <Sidebar className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>サイドバー表示/非表示</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="h-8 border-r border-gray-200 mx-1" />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => handleNotImplemented("元に戻す")}
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>元に戻す</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => handleNotImplemented("やり直す")}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>やり直す</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="h-8 border-r border-gray-200 mx-1" />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => handleNotImplemented("コピー")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>コピー</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => handleNotImplemented("削除")}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>削除</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="ml-auto flex items-center gap-1">
          <div className="flex items-center bg-gray-100 rounded-md">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={handleZoomOut}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>縮小</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="px-2 text-sm font-medium">
              {zoom}%
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={handleZoomIn}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>拡大</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      {/* Tab-based toolbar with context-specific tools */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-50 p-0 h-8">
          <TabsTrigger value="insert" className="text-xs h-8">挿入</TabsTrigger>
          <TabsTrigger value="text" className="text-xs h-8">テキスト</TabsTrigger>
          <TabsTrigger value="shape" className="text-xs h-8">図形</TabsTrigger>
          <TabsTrigger value="arrange" className="text-xs h-8">配置</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Toolbar content based on selected tab */}
      <div className="flex items-center gap-1 py-1">
        {activeTab === "insert" && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddText}
              className="h-8 flex items-center gap-1"
            >
              <Type className="h-4 w-4" />
              <span className="text-xs">テキスト</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddRect}
              className="h-8 flex items-center gap-1"
            >
              <Square className="h-4 w-4" />
              <span className="text-xs">四角形</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddCircle}
              className="h-8 flex items-center gap-1"
            >
              <Circle className="h-4 w-4" />
              <span className="text-xs">円形</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNotImplemented("画像追加")}
              className="h-8 flex items-center gap-1"
            >
              <Image className="h-4 w-4" />
              <span className="text-xs">画像</span>
            </Button>
          </>
        )}
        
        {activeTab === "text" && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={textFormatting.bold ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setTextFormatting({ ...textFormatting, bold: !textFormatting.bold })}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>太字</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={textFormatting.italic ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setTextFormatting({ ...textFormatting, italic: !textFormatting.italic })}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>斜体</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={textFormatting.underline ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setTextFormatting({ ...textFormatting, underline: !textFormatting.underline })}
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>下線</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="h-8 border-r border-gray-200 mx-1" />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={textFormatting.align === "left" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setTextFormatting({ ...textFormatting, align: "left" })}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>左揃え</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={textFormatting.align === "center" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setTextFormatting({ ...textFormatting, align: "center" })}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>中央揃え</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={textFormatting.align === "right" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setTextFormatting({ ...textFormatting, align: "right" })}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>右揃え</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={textFormatting.align === "justify" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setTextFormatting({ ...textFormatting, align: "justify" })}
                  >
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>両端揃え</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
        
        {activeTab === "arrange" && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleNotImplemented("グループ化")}
                  >
                    <Group className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>グループ化</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleNotImplemented("グループ解除")}
                  >
                    <Ungroup className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>グループ解除</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="h-8 border-r border-gray-200 mx-1" />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleNotImplemented("ロック")}
                  >
                    <LockKeyhole className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>ロック</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleNotImplemented("ロック解除")}
                  >
                    <Unlock className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>ロック解除</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="h-8 border-r border-gray-200 mx-1" />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleNotImplemented("前面へ移動")}
                  >
                    <ArrowBigUp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>前面へ移動</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleNotImplemented("背面へ移動")}
                  >
                    <ArrowBigDown className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>背面へ移動</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
    </div>
  );
}
