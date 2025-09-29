import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { spacing } from '../theme';
import HeaderIcon from './HeaderIcon';

export type HeaderProps = {
  icon: string;
  text: React.ReactNode;
  onPress?: () => void;
  profileImage?: string | null;
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

export default function Header({ icon, text, onPress, profileImage }: HeaderProps) {
  const library = iconLibraryMap[icon] || 'fontawesome6'; // Default to FontAwesome6 for unknown icons
  
  const renderIcon = () => {
    if (profileImage) {
      return (
        <Image 
          source={{ uri: profileImage }} 
          style={styles.profileImage}
          resizeMode="cover"
        />
      );
    }
    return <HeaderIcon icon={icon} library={library} size="large" />;
  };

  const content = (
    <View style={styles.container}>
      {renderIcon()}
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
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.sm,
  },
});
