import React from 'react';
import { StyleSheet, View, ViewStyle, Image } from 'react-native';
import { useTheme } from '../theme';
import { IconComponent, IconSource } from './types';

export type ChainTokenIconProps = {
  style?: ViewStyle;
  baseIcon: IconComponent | IconSource;
  overlayIcon?: IconSource;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  baseIcon: {
    position: 'absolute',
    width: 36,
    height: 36,
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
  },
  overlayIcon: {
    width: 16,
    height: 16,
  },
});

export default function ChainTokenIcon({
  style,
  baseIcon,
  overlayIcon,
}: ChainTokenIconProps) {
  const { colors } = useTheme();

  const containerStyle = [
    styles.container,
    {
      backgroundColor: colors.chainTokenBackground,
    },
  ];

  const overlayComponent = overlayIcon ? (
    <View style={styles.overlayContainer}>
      <Image
        source={overlayIcon as any}
        style={styles.overlayIcon}
        resizeMode="contain"
      />
    </View>
  ) : null;

  const renderBaseIcon = () => {
    // If baseIcon is a component (like EthIcon)
    if (typeof baseIcon === 'function') {
      const Component = baseIcon;
      return <Component style={styles.baseIcon} />;
    }

    // If baseIcon is an image source
    return (
      <Image source={baseIcon} style={styles.baseIcon} resizeMode="contain" />
    );
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      {/* Base icon (token icon) */}
      {renderBaseIcon()}

      {/* Overlay icon (chain icon) */}
      {overlayComponent}
    </View>
  );
}
