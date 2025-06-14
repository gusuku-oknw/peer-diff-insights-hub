
// デザイントークン: タイポグラフィ
export const typography = {
  // Font Families
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
    display: ['Inter', 'system-ui', 'sans-serif']
  },
  
  // Font Sizes
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }]
  },
  
  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  },
  
  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  }
} as const;

// セマンティックタイポグラフィスタイル
export const textStyles = {
  // Headings
  h1: {
    fontSize: typography.fontSize['4xl'][0],
    lineHeight: typography.fontSize['4xl'][1].lineHeight,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight
  },
  h2: {
    fontSize: typography.fontSize['3xl'][0],
    lineHeight: typography.fontSize['3xl'][1].lineHeight,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.tight
  },
  h3: {
    fontSize: typography.fontSize['2xl'][0],
    lineHeight: typography.fontSize['2xl'][1].lineHeight,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.normal
  },
  h4: {
    fontSize: typography.fontSize.xl[0],
    lineHeight: typography.fontSize.xl[1].lineHeight,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.normal
  },
  
  // Body Text
  body: {
    fontSize: typography.fontSize.base[0],
    lineHeight: typography.fontSize.base[1].lineHeight,
    fontWeight: typography.fontWeight.normal,
    letterSpacing: typography.letterSpacing.normal
  },
  bodySmall: {
    fontSize: typography.fontSize.sm[0],
    lineHeight: typography.fontSize.sm[1].lineHeight,
    fontWeight: typography.fontWeight.normal,
    letterSpacing: typography.letterSpacing.normal
  },
  
  // UI Elements
  button: {
    fontSize: typography.fontSize.sm[0],
    lineHeight: typography.fontSize.sm[1].lineHeight,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.wide
  },
  caption: {
    fontSize: typography.fontSize.xs[0],
    lineHeight: typography.fontSize.xs[1].lineHeight,
    fontWeight: typography.fontWeight.normal,
    letterSpacing: typography.letterSpacing.wide
  }
} as const;
