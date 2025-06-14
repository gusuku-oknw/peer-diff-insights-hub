
import React, { createContext, useContext, ReactNode } from 'react';
import { colors, modeColors } from '../tokens/colors';
import { typography, textStyles } from '../tokens/typography';
import { spacing, semanticSpacing } from '../tokens/spacing';
import { shadows, coloredShadows } from '../shadows';

// デザインシステムコンテキストの型定義
interface DesignSystemContextType {
  colors: typeof colors;
  modeColors: typeof modeColors;
  typography: typeof typography;
  textStyles: typeof textStyles;
  spacing: typeof spacing;
  semanticSpacing: typeof semanticSpacing;
  shadows: typeof shadows;
  coloredShadows: typeof coloredShadows;
  currentMode: 'presentation' | 'edit' | 'review';
  setMode: (mode: 'presentation' | 'edit' | 'review') => void;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);

interface DesignSystemProviderProps {
  children: ReactNode;
  initialMode?: 'presentation' | 'edit' | 'review';
}

export const DesignSystemProvider: React.FC<DesignSystemProviderProps> = ({ 
  children, 
  initialMode = 'presentation' 
}) => {
  const [currentMode, setCurrentMode] = React.useState<'presentation' | 'edit' | 'review'>(initialMode);

  const value: DesignSystemContextType = {
    colors,
    modeColors,
    typography,
    textStyles,
    spacing,
    semanticSpacing,
    shadows,
    coloredShadows,
    currentMode,
    setMode: setCurrentMode
  };

  return (
    <DesignSystemContext.Provider value={value}>
      <div 
        className="design-system-root w-full h-full"
        style={{
          '--ds-primary': modeColors[currentMode].primary,
          '--ds-accent': modeColors[currentMode].accent,
          '--ds-background': modeColors[currentMode].background,
          '--ds-text': modeColors[currentMode].text,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </DesignSystemContext.Provider>
  );
};

export const useDesignSystem = (): DesignSystemContextType => {
  const context = useContext(DesignSystemContext);
  if (context === undefined) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
};
