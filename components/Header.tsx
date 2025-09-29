import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../theme';
import HeaderIcon from './HeaderIcon';

export type HeaderProps = {
  icon: string;
  text: React.ReactNode;
};

// Map of icons to their appropriate libraries
const iconLibraryMap: Record<string, 'material' | 'ionicons' | 'fontawesome6'> = {
  // Person icons - use Ionicons
  'person': 'ionicons',
  
  // Coin/money icons - use FontAwesome6
  'coins': 'fontawesome6',
  'wallet': 'fontawesome6',
  
  // Action icons - use FontAwesome6
  'check-circle': 'fontawesome6',
  'key': 'fontawesome6',
};

export default function Header({ icon, text }: HeaderProps) {
  const library = iconLibraryMap[icon] || 'fontawesome6'; // Default to FontAwesome6 for unknown icons
  
  return (
    <View style={styles.container}>
      <HeaderIcon icon={icon} library={library} size="large" />
      {text}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
});
