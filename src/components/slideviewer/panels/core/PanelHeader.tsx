
import React from 'react';
import EnhancedPanelHeader from './EnhancedPanelHeader';

interface PanelHeaderProps {
  isVeryNarrow: boolean;
  isMobile: boolean;
  onToggleHide?: () => void;
}

const PanelHeader: React.FC<PanelHeaderProps> = (props) => {
  return <EnhancedPanelHeader {...props} />;
};

export default PanelHeader;
