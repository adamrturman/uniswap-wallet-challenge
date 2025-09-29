export const lightTheme = {
  primary: '#FC72FF',
  primaryDisabled: '#FAD6FF',
  primaryLight: '#FEF4FF',
  background: '#ffffff',
  backgroundSecondary: '#F4F4F4',
  
  text: '#0a0a0a',
  textSecondary: '#9AA0A6',
  textInverse: '#ffffff',
  inputText: '#0a0a0a',
  placeholderText: '#9AA0A6',
  
  border: '#EAEAEA',
  error: '#FF3B30',
  success: '#4CAF50',
  surface: '#F8F9FA',
  
  pillBackground: '#F4F4F4',
  pillSelectedBackground: '#FC72FF',
  pillSelectedText: '#ffffff',
  
  ethBackground: '#5B8DEF',
  chainTokenBackground: '#627EEA',
  tokenSelectorBackground: '#ffffff',
  
  shadow: '#000000',
} as const;

export const darkTheme = {
  primary: '#FC72FF',
  primaryDisabled: '#666666',
  primaryLight: '#FEF4FF',
  background: '#131313',
  backgroundSecondary: '#2A2A2A',
  
  text: '#ffffff',
  textSecondary: '#9AA0A6',
  textInverse: '#ffffff',
  inputText: '#ffffff',
  placeholderText: '#CCCCCC',
  
  border: '#333333',
  error: '#FF3B30',
  success: '#4CAF50',
  surface: '#1a1a1a',
  
  pillBackground: '#333333',
  pillSelectedBackground: '#FC72FF',
  pillSelectedText: '#ffffff',
  
  ethBackground: '#5B8DEF',
  chainTokenBackground: '#627EEA',
  tokenSelectorBackground: '#131313',
  
  shadow: '#000000',
} as const;

export const theme = lightTheme;

export type ThemeColors = typeof lightTheme | typeof darkTheme;
