import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import uniswapLogo from "../assets/Uniswap_icon_pink.png"

type LandingProps = {
  onImportWallet?: () => void;
  onWatchAddress?: () => void;
};

export default function Landing({ onImportWallet, onWatchAddress }: LandingProps) {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image
          source={uniswapLogo}
          style={{ width: 96, height: 104, resizeMode: 'contain' }}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={onImportWallet} activeOpacity={0.85}>
          <Text style={[styles.buttonText, styles.primaryText]}>Import a wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onWatchAddress} activeOpacity={0.85}>
          <Text style={[styles.buttonText, styles.secondaryText]}>Watch an address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PINK = '#FC72FF';
const LIGHT_GRAY = '#efefef';
const DARK_TEXT = '#0a0a0a';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: PINK,
  },
  secondaryButton: {
    backgroundColor: LIGHT_GRAY,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: DARK_TEXT,
  },
}); 