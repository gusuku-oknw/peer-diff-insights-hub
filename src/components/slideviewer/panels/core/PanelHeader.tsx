
import React from 'react';
import EnhancedPanelHeader from './EnhancedPanelHeader';

interface PanelHeaderProps {
  isVeryNarrow: boolean;
  isMobile: boolean;
  onToggleHide?: () => void;
  activeTab?: string;
  currentSlide?: number;
  totalSlides?: number;
  userType?: "student" | "enterprise";
}

const PanelHeader: React.FC<PanelHeaderProps> = ({ 
  isVeryNarrow, 
  isMobile, 
  onToggleHide,
  activeTab = "notes",
  currentSlide = 1,
  totalSlides = 1,
  userType = "enterprise"
}) => {
  const sizeClass = isVeryNarrow ? 'xs' : isMobile ? 'sm' : 'md';
  
  return (
    <EnhancedPanelHeader 
      activeTab={activeTab}
      currentSlide={currentSlide}
      totalSlides={totalSlides}
      userType={userType}
      sizeClass={sizeClass}
      onClose={onToggleHide}
    />
  );
};

export default PanelHeader;
