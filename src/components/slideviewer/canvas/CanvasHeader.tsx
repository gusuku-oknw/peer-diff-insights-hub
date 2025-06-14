
import React from "react";
import CanvasGuideOverlay from "@/features/slideviewer/components/canvas/states/CanvasGuideOverlay";
import CanvasShortcutsGuide from "./CanvasShortcutsGuide";

interface CanvasHeaderProps {
  showGuide: boolean;
  editable: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  onCloseGuide: () => void;
}

const CanvasHeader: React.FC<CanvasHeaderProps> = ({
  showGuide,
  editable,
  deviceType,
  onCloseGuide
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

      {/* Shortcuts guide in top-right corner */}
      {editable && (
        <div className="absolute top-4 right-4 z-10">
          <CanvasShortcutsGuide />
        </div>
      )}
    </>
  );
};

export default CanvasHeader;
