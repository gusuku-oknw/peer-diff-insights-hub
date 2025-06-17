import React from "react";
import CanvasContextMenu from "./CanvasContextMenu";
import EmptyCanvasState from "./EmptyCanvasState";
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
      <div className="bg-white rounded-lg shadow-lg border relative transition-all duration-200 ease-out">
        {/* Canvas element with direct sizing */}
        <canvas 
          ref={canvasRef}
          className="block rounded-lg"
          style={{
            imageRendering: 'auto'
          }}
        />

        {/* Empty state overlay positioned absolutely */}
        {isEmpty && isReady && (
          <div 
            className="absolute inset-0 flex items-center justify-center rounded-lg pointer-events-none"
            style={{
              width: `${canvasConfig.displayWidth}px`,
              height: `${canvasConfig.displayHeight}px`
            }}
          >
            <div className="pointer-events-auto">
              <EmptyCanvasState
                onAddText={onAddText}
                onAddShape={onAddShape}
                onAddImage={onAddImage}
                slideNumber={currentSlide}
                editable={editable}
              />
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {!isReady && !error && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg"
            style={{
              width: `${canvasConfig.displayWidth}px`,
              height: `${canvasConfig.displayHeight}px`
            }}
          >
            <CanvasLoadingState 
              progress={performance.metrics?.fps || 0}
              message="キャンバスを初期化中..."
            />
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg"
            style={{
              width: `${canvasConfig.displayWidth}px`,
              height: `${canvasConfig.displayHeight}px`
            }}
          >
            <CanvasErrorState
              error={error}
              onRetry={onRetry}
              onReset={onReset}
            />
          </div>
        )}
      </div>
    </CanvasContextMenu>
  );
};

export default CanvasContainer;
