
import React from 'react';
import { Button } from '@/components/ui/button';
import { useSlideStore } from '@/stores/slide.store';

interface ModeSpecificActionsProps {
  mode?: "presentation" | "edit" | "review";
  displayCount?: number;
  isFullScreen?: boolean;
  showPresenterNotes?: boolean;
  userType?: "student" | "enterprise";
  onSaveChanges?: () => void;
  onShowPresenterNotesToggle?: () => void;
  onStartPresentation?: () => void;
  leftSidebarOpen?: boolean;
  onLeftSidebarToggle?: () => void;
}

const ModeSpecificActions: React.FC<ModeSpecificActionsProps> = ({ 
  mode,
  displayCount,
  isFullScreen,
  showPresenterNotes,
  userType,
  onSaveChanges,
  onShowPresenterNotesToggle,
  onStartPresentation,
  leftSidebarOpen = false, 
  onLeftSidebarToggle = () => {} 
}) => {
  const viewerMode = useSlideStore(state => state.viewerMode);
  const setViewerMode = useSlideStore(state => state.setViewerMode);

  const currentMode = mode || viewerMode;

  const handleModeToggle = () => {
    const nextMode = currentMode === 'presentation' ? 'edit' : 'presentation';
    setViewerMode(nextMode);
  };

  // Show save button for edit mode
  if (currentMode === 'edit' && onSaveChanges) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onSaveChanges}>
          保存
        </Button>
      </div>
    );
  }

  // Show presentation controls for presentation mode
  if (currentMode === 'presentation' && onStartPresentation) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onStartPresentation}>
          プレゼンテーション開始
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleModeToggle}
      >
        {currentMode === 'presentation' ? '編集モード' : 'プレゼンテーションモード'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onLeftSidebarToggle}
      >
        {leftSidebarOpen ? '閉じる' : '開く'}
      </Button>
    </div>
  );
};

export default ModeSpecificActions;
