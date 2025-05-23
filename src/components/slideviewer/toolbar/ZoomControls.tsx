
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCallback } from "react";

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const ZoomControls = ({ zoom, onZoomChange }: ZoomControlsProps) => {
  // Memoized zoom change handler with bounds checking
  const handleZoomChange = useCallback((newZoom: number) => {
    // Ensure zoom stays between 50% and 200%
    const boundedZoom = Math.min(Math.max(newZoom, 50), 200);
    onZoomChange(boundedZoom);
  }, [onZoomChange]);

  // Increment/decrement zoom by a fixed percentage
  const incrementZoom = useCallback(() => {
    handleZoomChange(zoom + 10);
  }, [zoom, handleZoomChange]);

  // Decrement zoom by a fixed percentage
  const decrementZoom = useCallback(() => {
    handleZoomChange(zoom - 10);
  }, [zoom, handleZoomChange]);

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <span className="font-medium">{zoom}%</span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 rotate-90" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>ズーム設定</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleZoomChange(50)}>50%</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleZoomChange(75)}>75%</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleZoomChange(100)}>100% (デフォルト)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleZoomChange(125)}>125%</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleZoomChange(150)}>150%</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleZoomChange(200)}>200%</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        onClick={decrementZoom} 
        variant="ghost" 
        size="icon" 
        className="rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center hover:bg-blue-50"
      >
        <span className="font-medium">-</span>
      </Button>
      
      <Button 
        onClick={incrementZoom} 
        variant="ghost" 
        size="icon" 
        className="rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center hover:bg-blue-50"
      >
        <span className="font-medium">+</span>
      </Button>
    </div>
  );
};

export default ZoomControls;
