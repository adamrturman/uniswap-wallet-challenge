export const radius = {
  xs: 4,     // 4px - small elements like tags
  sm: 6,     // 6px - small buttons
  md: 8,     // 8px - medium elements
  lg: 12,    // 12px - large elements like input fields
  xl: 16,    // 16px - cards and containers
  xxl: 20,   // 20px - large cards
} as const;

export type Radius = typeof radius;
