import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import uniswapLogo from "../assets/Uniswap_icon_pink.png";
import { useTheme, spacing, radius } from '../theme';
import { NavigationType } from '../types';
import Button from './Button';

export default function Landing() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: spacing.xl * 4 }]}>
      <View style={styles.logoWrapper}>
        <View style={[styles.logoContainer, { backgroundColor: colors.primaryLight, padding: spacing.xl }]}>
          <Image
            source={uniswapLogo}
            style={{ width: spacing.xxxl * 3, height: spacing.xxxl * 3, resizeMode: 'contain' }}
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
          onPress={() => navigation.navigate('EnterRecoveryPhrase')}
          variant="primary"
          fullWidth
        />

        <Button 
          title="Watch an address"
          onPress={() => navigation.navigate('EnterWatchAddress')}
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
    borderRadius: radius.xxl,
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
    paddingHorizontal: spacing.xl,
  },
}); 