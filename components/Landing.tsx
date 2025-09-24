import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import uniswapLogo from "../assets/Uniswap_icon_pink.png";
import { useTheme, spacing } from '../theme';
import Button from './Button';

type LandingProps = {
  onImportWallet?: () => void;
  onWatchAddress?: () => void;
};

export default function Landing({ onImportWallet, onWatchAddress }: LandingProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: spacing.xl * 4 }]}>
      <View style={styles.logoWrapper}>
        <View style={[styles.logoContainer, { backgroundColor: colors.primaryLight, padding: spacing.xl }]}>
          <Image
            source={uniswapLogo}
            style={{ width: 96, height: 104, resizeMode: 'contain' }}
          />
        </View>
      </View>

      <View style={[styles.actions, { 
        gap: spacing.lg, 
        paddingBottom: spacing.xl * 2, 
        paddingTop: spacing.xl 
      }]}>
        <Button 
          title="Import a wallet"
          onPress={onImportWallet || (() => {})}
          variant="primary"
          fullWidth
        />

        <Button 
          title="Watch an address"
          onPress={onWatchAddress || (() => {})}
          variant="secondary"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
}); 