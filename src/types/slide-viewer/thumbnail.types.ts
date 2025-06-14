
export type ThumbnailViewMode = 'horizontal' | 'grid' | 'list' | 'compact';

export interface ThumbnailDisplaySettings {
  viewMode: ThumbnailViewMode;
  thumbnailSize: 'small' | 'medium' | 'large';
  showDetails: boolean;
  showProgress: boolean;
}

export interface SlideSearchFilters {
  searchText: string;
  status: 'all' | 'reviewed' | 'unreviewed' | 'commented';
  sortBy: 'created' | 'updated' | 'title' | 'progress';
  sortOrder: 'asc' | 'desc';
}

export interface ThumbnailControlsProps {
  displaySettings: ThumbnailDisplaySettings;
  searchFilters: SlideSearchFilters;
  onDisplaySettingsChange: (settings: ThumbnailDisplaySettings) => void;
  onSearchFiltersChange: (filters: SlideSearchFilters) => void;
  slideCount: number;
  userType?: "student" | "enterprise";
}
