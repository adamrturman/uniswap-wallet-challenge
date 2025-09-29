export const lightTheme = {
  primary: '#FC72FF',
  primaryDisabled: '#FAD6FF',
  primaryLight: '#FEF4FF',
  background: '#ffffff',
  backgroundSecondary: '#F4F4F4',
  
  text: '#0a0a0a',
  textSecondary: '#9AA0A6',
  textInverse: '#ffffff',
  
  border: '#EAEAEA',
  error: '#FF3B30',
  success: '#4CAF50',
  surface: '#F8F9FA',
  
  pillBackground: '#F4F4F4',
  pillSelectedBackground: '#FC72FF',
  pillSelectedText: '#ffffff',
  
  ethBackground: '#5B8DEF',
  chainTokenBackground: '#627EEA',
  
  shadow: '#000000',
} as const;

export const darkTheme = {
  primary: '#FC72FF',
  primaryDisabled: '#FAD6FF',
  primaryLight: '#FEF4FF',
  background: '#0a0a0a',
  backgroundSecondary: '#1a1a1a',
  
  text: '#ffffff',
  textSecondary: '#9AA0A6',
  textInverse: '#0a0a0a',
  
  border: '#333333',
  error: '#FF3B30',
  success: '#4CAF50',
  surface: '#1a1a1a',
  
  pillBackground: '#333333',
  pillSelectedBackground: '#FC72FF',
  pillSelectedText: '#ffffff',
  
  ethBackground: '#5B8DEF',
  chainTokenBackground: '#627EEA',
  
  shadow: '#000000',
} as const;

export const theme = lightTheme;

export type ThemeColors = typeof lightTheme | typeof darkTheme;
