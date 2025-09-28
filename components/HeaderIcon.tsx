import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '../theme';

export type IconSize = 'small' | 'medium' | 'large' | 'xlarge';

export type HeaderIconProps = {
  icon: string;
  library?: 'material' | 'ionicons' | 'fontawesome6';
  size?: IconSize;
  backgroundColor?: string;
  style?: ViewStyle;
};

const sizeConfig = {
  small: {
    container: 32,
    icon: 16,
  },
  medium: {
    container: 40,
    icon: 20,
  },
  large: {
    container: 60,
    icon: 28,
  },
  xlarge: {
    container: 64,
    icon: 32,
  },
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function HeaderIcon({ 
  icon, 
  library = 'material', 
  size = 'medium',
  backgroundColor,
  style 
}: HeaderIconProps) {
  const { colors } = useTheme();
  const config = sizeConfig[size];
  
  const dynamicStyles: ViewStyle = {
    width: config.container,
    height: config.container,
    borderRadius: config.container / 2,
    backgroundColor: backgroundColor || colors.primaryLight,
  };

  const IconComponent = library === 'ionicons' ? Ionicons : 
                        library === 'fontawesome6' ? FontAwesome6 : MaterialIcons;

  return (
    <View style={[styles.container, dynamicStyles, style]}>
      <IconComponent
        name={icon as any}
        color={colors.primary}
        size={config.icon}
      />
    </View>
  );
}
