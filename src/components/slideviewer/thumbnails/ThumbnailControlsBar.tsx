
import React from 'react';
import ThumbnailViewModeSelector from './ThumbnailViewModeSelector';
import ThumbnailSizeControls from './ThumbnailSizeControls';
import ThumbnailFilterSelector from './ThumbnailFilterSelector';

type ViewMode = 'horizontal' | 'grid' | 'list';
type FilterMode = 'all' | 'reviewed' | 'unreviewed' | 'commented';

interface ThumbnailControlsBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  thumbnailWidth: number;
  onThumbnailSizeChange: (size: number) => void;
  minSize: number;
  maxSize: number;
  filterMode: FilterMode;
  onFilterChange: (filter: FilterMode) => void;
  currentSlide: number;
  totalSlides: number;
  filteredCount: number;
}

const ThumbnailControlsBar = ({
  viewMode,
  onViewModeChange,
  thumbnailWidth,
  onThumbnailSizeChange,
  minSize,
  maxSize,
  filterMode,
  onFilterChange,
  currentSlide,
  totalSlides,
  filteredCount
}: ThumbnailControlsBarProps) => {
  return (
    <div className="flex items-center justify-between px-3 py-1 bg-white border-b border-gray-200 h-7">
      {/* Left: View mode toggle */}
      <ThumbnailViewModeSelector
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />

      {/* Center: Size and filter controls */}
      <div className="flex items-center gap-2">
        <ThumbnailSizeControls
          currentSize={thumbnailWidth}
          onSizeChange={onThumbnailSizeChange}
          minSize={minSize}
          maxSize={maxSize}
          step={20}
        />

        <ThumbnailFilterSelector
          filterMode={filterMode}
          onFilterChange={onFilterChange}
        />
      </div>

      {/* Right: Info display */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>{currentSlide}/{totalSlides}</span>
        <span className="text-gray-300">|</span>
        <span>{filteredCount}表示</span>
      </div>
    </div>
  );
};

export default ThumbnailControlsBar;
