import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import uniswapLogo from "../assets/Uniswap_icon_pink.png";
import { useTheme } from '../theme';

type LandingProps = {
  onImportWallet?: () => void;
  onWatchAddress?: () => void;
};

export default function Landing({ onImportWallet, onWatchAddress }: LandingProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.logoWrapper}>
        <View style={[styles.logoContainer, { backgroundColor: colors.primaryLight }]}>
          <Image
            source={uniswapLogo}
            style={{ width: 96, height: 104, resizeMode: 'contain' }}
          />
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]} 
          onPress={onImportWallet} 
          activeOpacity={0.85}
        >
          <Text style={[styles.buttonText, { color: colors.textInverse }]}>Import a wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.backgroundSecondary, shadowColor: colors.shadow }]} 
          onPress={onWatchAddress} 
          activeOpacity={0.85}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>Watch an address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    borderRadius: 24,
    padding: 20,
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
    gap: 16,
  },
  button: {
    width: '84%',
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
  },
}); 