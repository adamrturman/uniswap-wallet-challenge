export const lightTheme = {
  primary: '#FC72FF',
  primaryDisabled: '#FAD6FF',
  background: '#ffffff',
  backgroundSecondary: '#F4F4F4',
  
  text: '#0a0a0a',
  textSecondary: '#9AA0A6',
  textInverse: '#ffffff',
  
  border: '#EAEAEA',
  
  pillBackground: '#F4F4F4',
  pillSelectedBackground: '#FC72FF',
  pillSelectedText: '#ffffff',
  
  ethBackground: '#5B8DEF',
  
  shadow: '#000000',
} as const;

export const theme = lightTheme;

export type ThemeColors = typeof lightTheme;
