
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSlideStore } from "@/stores/slideStore";
import { useToast } from "@/hooks/use-toast";

import CommonToolbar from "./toolbar/CommonToolbar";
import InsertToolbar from "./toolbar/InsertToolbar";
import TextFormatToolbar from "./toolbar/TextFormatToolbar";
import ArrangeToolbar from "./toolbar/ArrangeToolbar";

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

  const handleTextFormattingChange = (newState: any) => {
    setTextFormatting(newState);
  };

  return (
    <div className="bg-white border-b border-gray-200 py-1 px-2 flex flex-col gap-1">
      {/* Upper toolbar with common actions */}
      <CommonToolbar 
        toggleSidebar={toggleSidebar}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onNotImplemented={handleNotImplemented}
      />
      
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
          <InsertToolbar 
            onAddText={handleAddText}
            onAddRect={handleAddRect}
            onAddCircle={handleAddCircle}
            onNotImplemented={handleNotImplemented}
          />
        )}
        
        {activeTab === "text" && (
          <TextFormatToolbar 
            textFormatting={textFormatting}
            onTextFormattingChange={handleTextFormattingChange}
          />
        )}
        
        {activeTab === "arrange" && (
          <ArrangeToolbar 
            onNotImplemented={handleNotImplemented}
          />
        )}
      </div>
    </div>
  );
}
