import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, ThemeColors } from './colors';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  colors: ThemeColors;
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = '@theme_mode';

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Save theme preference to storage when it changes
  useEffect(() => {
    if (!isLoading) {
      const saveTheme = async () => {
        try {
          await AsyncStorage.setItem(THEME_STORAGE_KEY, themeMode);
        } catch (error) {
          console.error('Failed to save theme preference:', error);
        }
      };

      saveTheme();
    }
  }, [themeMode, isLoading]);

  // Memoize the toggle function to prevent unnecessary re-renders
  const toggleTheme = useCallback(() => {
    setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  }, []);

  // Memoize the colors object to prevent unnecessary re-renders
  const colors = useMemo(() => {
    return themeMode === 'light' ? lightTheme : darkTheme;
  }, [themeMode]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    colors,
    themeMode,
    toggleTheme
  }), [colors, themeMode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
