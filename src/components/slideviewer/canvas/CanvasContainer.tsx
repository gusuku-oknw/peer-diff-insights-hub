
import React from "react";
import CanvasContextMenu from "./CanvasContextMenu";
import EmptyCanvasState from "@/features/slideviewer/components/canvas/states/EmptyCanvasState";
import CanvasLoadingState from "@/components/slideviewer/canvas/CanvasLoadingState";
import CanvasErrorState from "@/components/slideviewer/canvas/CanvasErrorState";

interface CanvasContainerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvasConfig: any;
  zoomLevel: number;
  selectedObject: any;
  isEmpty: boolean;
  isReady: boolean;
  error: string | null;
  editable: boolean;
  currentSlide: number;
  performance: any;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onDuplicate: () => void;
  onRotate: () => void;
  onAddText: () => void;
  onAddShape: () => void;
  onAddImage: () => void;
  onRetry: () => void;
  onReset: () => void;
  hasClipboard: boolean;
}

const CanvasContainer: React.FC<CanvasContainerProps> = ({
  canvasRef,
  canvasConfig,
  zoomLevel,
  selectedObject,
  isEmpty,
  isReady,
  error,
  editable,
  currentSlide,
  performance,
  onCopy,
  onPaste,
  onDelete,
  onBringToFront,
  onSendToBack,
  onDuplicate,
  onRotate,
  onAddText,
  onAddShape,
  onAddImage,
  onRetry,
  onReset,
  hasClipboard
}) => {
  return (
    <CanvasContextMenu
      selectedObject={selectedObject}
      onCopy={onCopy}
      onPaste={onPaste}
      onDelete={onDelete}
      onBringToFront={onBringToFront}
      onSendToBack={onSendToBack}
      onDuplicate={onDuplicate}
      onRotate={onRotate}
      hasClipboard={hasClipboard}
    >
      <div 
        className="bg-white rounded-lg shadow-lg border relative"
        style={{
          width: canvasConfig.displayWidth,
          height: canvasConfig.displayHeight,
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease-out'
        }}
      >
        {/* High Resolution Fabric.js Canvas */}
        <canvas 
          ref={canvasRef}
          className="block rounded-lg"
          style={{
            width: '100%',
            height: '100%',
            imageRendering: 'auto'
          }}
        />

        {/* Empty state overlay */}
        {isEmpty && isReady && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg">
            <EmptyCanvasState
              onAddText={onAddText}
              onAddShape={onAddShape}
              onAddImage={onAddImage}
              slideNumber={currentSlide}
              editable={editable}
            />
          </div>
        )}
        
        {/* Loading state */}
        {!isReady && !error && (
          <CanvasLoadingState 
            progress={performance.metrics?.fps || 0}
            message="統合キャンバスを初期化中..."
          />
        )}
        
        {/* Error state */}
        {error && (
          <CanvasErrorState
            error={error}
            onRetry={onRetry}
            onReset={onReset}
          />
        )}
      </div>
    </CanvasContextMenu>
  );
};

export default CanvasContainer;
