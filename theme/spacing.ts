export const spacing = {
  xs: 4,    // 4px (0.5 * 8)
  sm: 8,    // 8px (1 * 8) - base unit
  md: 16,   // 16px (2 * 8)
  lg: 24,   // 24px (3 * 8)
  xl: 32,   // 32px (4 * 8)
  xxl: 40,  // 40px (5 * 8)
  xxxl: 48, // 48px (6 * 8)
} as const;

export type Spacing = typeof spacing;
