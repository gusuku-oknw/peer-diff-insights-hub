
import React from "react";
import CanvasGuideOverlay from "@/features/slideviewer/components/canvas/states/CanvasGuideOverlay";
import CanvasShortcutsGuide from "./CanvasShortcutsGuide";
import ZoomControlsEnhanced from "../toolbar/ZoomControlsEnhanced";
import type { DeviceType } from "@/hooks/slideviewer/canvas/useCanvasState";

interface CanvasHeaderProps {
  showGuide: boolean;
  editable: boolean;
  deviceType: DeviceType;
  zoomLevel: number;
  onCloseGuide: () => void;
  onZoomChange: (zoom: number) => void;
}

const CanvasHeader: React.FC<CanvasHeaderProps> = ({
  showGuide,
  editable,
  deviceType,
  zoomLevel,
  onCloseGuide,
  onZoomChange
}) => {
  return (
    <>
      {/* Guide overlay */}
      {showGuide && (
        <CanvasGuideOverlay
          deviceType={deviceType}
          onClose={onCloseGuide}
        />
      )}

      {/* Enhanced Zoom Controls - Top Left */}
      <div className="absolute top-4 left-4 z-10">
        <ZoomControlsEnhanced
          zoom={zoomLevel}
          onZoomChange={onZoomChange}
          isCompact={deviceType === 'mobile'}
        />
      </div>

      {/* Shortcuts guide in top-right corner */}
      {editable && deviceType !== 'mobile' && (
        <div className="absolute top-4 right-4 z-10">
          <CanvasShortcutsGuide />
        </div>
      )}
    </>
  );
};

export default CanvasHeader;
