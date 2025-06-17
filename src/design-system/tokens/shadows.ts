
// デザイントークン: シャドウ
const baseShadows = {
  // Elevation levels
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

export const shadows = {
  ...baseShadows,
  
  // Semantic shadows
  button: {
    default: baseShadows.sm,
    hover: baseShadows.md,
    active: baseShadows.inner,
    focus: '0 0 0 3px rgb(59 130 246 / 0.5)'
  },
  
  card: {
    default: baseShadows.base,
    hover: baseShadows.lg,
    active: baseShadows.md
  },
  
  modal: baseShadows['2xl'],
  dropdown: baseShadows.lg,
  tooltip: baseShadows.md
} as const;

// カラー付きシャドウ
export const coloredShadows = {
  primary: '0 4px 6px -1px rgb(59 130 246 / 0.1), 0 2px 4px -2px rgb(59 130 246 / 0.1)',
  success: '0 4px 6px -1px rgb(34 197 94 / 0.1), 0 2px 4px -2px rgb(34 197 94 / 0.1)',
  warning: '0 4px 6px -1px rgb(245 158 11 / 0.1), 0 2px 4px -2px rgb(245 158 11 / 0.1)',
  error: '0 4px 6px -1px rgb(239 68 68 / 0.1), 0 2px 4px -2px rgb(239 68 68 / 0.1)'
} as const;
