import React, { memo, useMemo, useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme';

type ThemeToggleProps = {
  onPress?: () => void;
};

const ThemeToggle = memo(function ThemeToggle({ onPress }: ThemeToggleProps) {
  const { colors, themeMode, toggleTheme } = useTheme();

  const iconName = useMemo(() => {
    return themeMode === 'light' ? 'weather-night' : 'weather-sunny';
  }, [themeMode]);

  // Memoize the press handler to prevent unnecessary re-renders
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
    }
    toggleTheme();
  }, [onPress, toggleTheme]);

  // Show empty div if icon name is not available
  if (!iconName) {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <View style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <MaterialCommunityIcons
        name={iconName}
        size={24}
        color={colors.primary}
      />
    </TouchableOpacity>
  );
});

export default ThemeToggle;
