import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

export type IconSize = 'small' | 'medium' | 'large' | 'xlarge';

export type HeaderIconProps = {
  name: string;
  library?: 'material' | 'ionicons';
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

export default function HeaderIcon({ 
  name, 
  library = 'material', 
  size = 'medium',
  backgroundColor,
  style 
}: HeaderIconProps) {
  const { colors } = useTheme();
  
  const config = sizeConfig[size];
  const iconSize = config.icon;
  const containerSize = config.container;
  
  const containerStyle: ViewStyle = {
    width: containerSize,
    height: containerSize,
    borderRadius: containerSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: backgroundColor || colors.primaryLight,
  };

  const renderIcon = () => {
    const iconProps = {
      name: name as any,
      color: colors.primary,
      size: iconSize,
    };

    if (library === 'ionicons') {
      return <Ionicons {...iconProps} />;
    }
    
    return <MaterialIcons {...iconProps} />;
  };

  return (
    <View style={[containerStyle, style]}>
      {renderIcon()}
    </View>
  );
}
