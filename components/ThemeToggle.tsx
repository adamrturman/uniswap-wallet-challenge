import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme';

type ThemeToggleProps = {
  onPress?: () => void;
};

export default function ThemeToggle({ onPress }: ThemeToggleProps) {
  const { colors, themeMode, toggleTheme } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    toggleTheme();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons 
        name={themeMode === 'light' ? 'weather-night' : 'weather-sunny'} 
        size={24} 
        color={colors.primary} 
      />
    </TouchableOpacity>
  );
}
