import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme';

type LogoutButtonProps = {
  onPress: () => void;
};

export default function LogoutButton({ onPress }: LogoutButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons 
        name="exit-run" 
        size={24} 
        color={colors.text} 
      />
    </TouchableOpacity>
  );
}

