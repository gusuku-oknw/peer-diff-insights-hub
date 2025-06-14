
// デザイントークン: パネルシステム
export const panelTokens = {
  // パネル幅とブレークポイント
  breakpoints: {
    mobile: 320,
    tablet: 768,
    desktop: 1024,
    large: 1440,
  },
  
  // パネル幅設定
  panelWidths: {
    mobile: {
      min: 280,
      max: 320,
      optimal: 300
    },
    tablet: {
      min: 350,
      max: 450,
      optimal: 400
    },
    desktop: {
      min: 400,
      max: 500,
      optimal: 450
    },
    large: {
      min: 450,
      max: 600,
      optimal: 500
    }
  },
  
  // パネル色彩システム
  colors: {
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      accent: '#f1f5f9'
    },
    border: {
      light: '#e2e8f0',
      medium: '#cbd5e1',
      dark: '#94a3b8'
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
      muted: '#64748b'
    },
    status: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },
  
  // タブシステム色
  tabColors: {
    notes: {
      primary: '#3b82f6',
      background: '#eff6ff',
      hover: '#dbeafe',
      active: '#bfdbfe'
    },
    review: {
      primary: '#8b5cf6',
      background: '#f3e8ff',
      hover: '#e9d5ff',
      active: '#d8b4fe'
    },
    dashboard: {
      primary: '#06b6d4',
      background: '#ecfeff',
      hover: '#cffafe',
      active: '#a5f3fc'
    },
    checklist: {
      primary: '#10b981',
      background: '#ecfdf5',
      hover: '#d1fae5',
      active: '#a7f3d0'
    }
  }
} as const;

// レスポンシブヘルパー関数
export const getOptimalPanelWidth = (screenWidth: number): number => {
  const { breakpoints, panelWidths } = panelTokens;
  
  if (screenWidth < breakpoints.tablet) {
    return Math.min(screenWidth * 0.85, panelWidths.mobile.max);
  } else if (screenWidth < breakpoints.desktop) {
    return Math.min(screenWidth * 0.5, panelWidths.tablet.optimal);
  } else if (screenWidth < breakpoints.large) {
    return Math.min(screenWidth * 0.35, panelWidths.desktop.optimal);
  } else {
    return Math.min(screenWidth * 0.25, panelWidths.large.optimal);
  }
};

export const getPanelSizeClass = (width: number): 'xs' | 'sm' | 'md' | 'lg' => {
  if (width < 280) return 'xs';  // 極小：アイコンのみ
  if (width < 350) return 'sm';  // 小：アクティブタブのみテキスト
  if (width < 450) return 'md';  // 中：短縮ラベル
  return 'lg';                   // 大：フルラベル
};
