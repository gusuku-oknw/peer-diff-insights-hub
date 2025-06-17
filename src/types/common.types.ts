
// Common types used across the application
export type UserRole = "student" | "business" | "debugger" | "guest";
export type ViewerMode = "presentation" | "edit" | "review";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar?: string;
}

export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PaginationInfo {
  current: number;
  total: number;
}

export interface DisplayInfo {
  count: number;
  isFullScreen: boolean;
}

// Layout related types
export interface LayoutDimensions {
  width: number;
  height: number;
}

export interface ResizableConfig {
  minWidth?: number;
  maxWidth?: number;
  initialWidth?: number;
}
