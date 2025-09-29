import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { spacing } from '../theme';
import HeaderIcon from './HeaderIcon';

export type HeaderProps = {
  icon: string;
  text: React.ReactNode;
  onPress?: () => void;
};

// Map of icons to their appropriate libraries
const iconLibraryMap: Record<string, 'material' | 'ionicons' | 'fontawesome6'> = {
  'person': 'ionicons',
  'coins': 'fontawesome6',
  'wallet': 'material',
  'check-circle': 'fontawesome6',
  'key': 'fontawesome6',
};

export default function Header({ icon, text, onPress }: HeaderProps) {
  const library = iconLibraryMap[icon] || 'fontawesome6'; // Default to FontAwesome6 for unknown icons

  const content = (
    <View style={styles.container}>
      <HeaderIcon icon={icon} library={library} size="large" />
      {text}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
});
