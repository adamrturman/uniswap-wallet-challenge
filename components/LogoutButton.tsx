import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
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
      <SimpleLineIcons 
        name="logout" 
        size={24} 
        color={colors.text} 
      />
    </TouchableOpacity>
  );
}

