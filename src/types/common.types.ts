
// アプリ全体で使用される共通型定義

export type UserRole = "student" | "enterprise";

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
