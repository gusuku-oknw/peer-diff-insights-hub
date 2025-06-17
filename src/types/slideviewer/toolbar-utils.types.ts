// Fix the import path
import { useSlideStore } from '@/stores/slide.store';

export type ToolbarAction = {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  condition?: (state: ReturnType<typeof useSlideStore.getState>) => boolean;
};
