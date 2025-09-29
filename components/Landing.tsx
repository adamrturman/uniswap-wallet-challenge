import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import uniswapLogo from "../assets/Uniswap_icon_pink.png";
import { useTheme, spacing, radius } from '../theme';
import { NavigationType } from '../types';
import Button from './Button';
import ScreenWrapper from './ScreenWrapper';

export default function Landing() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();
  
  return (
    <ScreenWrapper disableBackButton={true}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={styles.logoWrapper}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primaryLightDark, padding: spacing.xl, shadowColor: colors.shadow }]}>
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
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
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