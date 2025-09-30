export const typography = {
  // Font weights
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
  },

  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },

  // Line heights
  lineHeights: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
  },
} as const;

export type TypographyWeight = keyof typeof typography.weights;
export type TypographySize = keyof typeof typography.sizes;
export type TypographyLineHeight = keyof typeof typography.lineHeights;
