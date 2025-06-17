import React from 'react';
import { Button } from '@/components/ui/button';
import { useSlideStore } from '@/stores/slide.store'; // Fix import path

interface ModeSpecificActionsProps {
  leftSidebarOpen: boolean;
  onLeftSidebarToggle: () => void;
}

const ModeSpecificActions: React.FC<ModeSpecificActionsProps> = ({ leftSidebarOpen, onLeftSidebarToggle }) => {
  const viewerMode = useSlideStore(state => state.viewerMode);
  const toggleViewerMode = useSlideStore(state => state.toggleViewerMode);

  const handleModeToggle = () => {
    toggleViewerMode();
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleModeToggle}
      >
        {viewerMode === 'presentation' ? '編集モード' : 'プレゼンテーションモード'}
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
