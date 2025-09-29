import React from 'react';
import { StyleSheet, View, ViewStyle, Image, ImageSourcePropType } from 'react-native';
import ethIcon from '../assets/eth-diamond-black.png';
import { useTheme } from '../theme';

export type ChainTokenIconProps = {
  style?: ViewStyle;
  baseIcon?: any;
  overlayIcon?: ImageSourcePropType;
};


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ethIcon: {
    position: 'absolute',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function ChainTokenIcon({ 
  style,
  baseIcon,
  overlayIcon
}: ChainTokenIconProps) {
  const { colors } = useTheme();
  
  const containerStyle: ViewStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.chainTokenBackground,
  };

  const overlayComponent = overlayIcon ? (
    <View
      style={[
        styles.overlayContainer,
        {
          width: 16,
          height: 16,
        }
      ]}
    >
      <Image
        source={overlayIcon}
        style={{
          width: 16,
          height: 16,
        }}
        resizeMode="contain"
      />
    </View>
  ) : null;

  const renderBaseIcon = () => {
    const iconToUse = baseIcon || ethIcon;
    
    // If baseIcon is a component (like EthIcon)
    if (typeof iconToUse === 'function') {
      const Component = iconToUse;
      return <Component style={[styles.ethIcon, { width: 36, height: 36 }]} />;
    }
    
    // If baseIcon is an image source
    return (
      <Image
        source={iconToUse}
        style={[
          styles.ethIcon,
          {
            width: 36,
            height: 36,
          }
        ]}
        resizeMode="contain"
      />
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
