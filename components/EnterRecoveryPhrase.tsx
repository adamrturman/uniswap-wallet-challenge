import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Wallet } from 'ethers';
import { useTheme, spacing, typography } from '../theme';
import { NavigationType } from '../types';
import Button from './Button';
import Header from './Header';
import ScreenWrapper from './ScreenWrapper';
import Input from './Input';

type EnterRecoveryPhraseProps = {
  onContinue: (phrase: string) => void;
};

export default function EnterRecoveryPhrase({
  onContinue,
}: EnterRecoveryPhraseProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();
  const [phrase, setPhrase] = useState('');
  const [isValidPhrase, setIsValidPhrase] = useState(false);

  const handlePhraseChange = (newPhrase: string) => {
    setPhrase(newPhrase);

    if (newPhrase.trim().length === 0) {
      setIsValidPhrase(false);
      return;
    }

    try {
      Wallet.fromMnemonic(newPhrase);
      setIsValidPhrase(true);
    } catch {
      setIsValidPhrase(false);
    }
  };

  const handleContinue = () => {
    if (onContinue && isValidPhrase) {
      onContinue(phrase);
      navigation.navigate('Portfolio');

      // Clear the input field for when user comes back
      setPhrase('');
    }
  };

  return (
    <ScreenWrapper>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.content}>
        <Header
          icon="key"
          text={
            <View>
              <Text style={[styles.title, { color: colors.text }]}>
                Enter your recovery phrase
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Your recovery phrase will only be stored locally on your device.
              </Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <Input
            value={phrase}
            onChangeText={handlePhraseChange}
            placeholder="Type or paste your recovery phrase"
            isValid={isValidPhrase}
            errorMessage="Invalid recovery phrase. Please check and try again."
            multiline
            minHeight={120}
            maxHeight={200}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View
        style={[
          styles.buttonContainer,
          {
            paddingHorizontal: spacing.xl,
            paddingBottom: spacing.xl * 2,
            paddingTop: spacing.xl,
          },
        ]}
      >
        <Button
          title="Continue"
          onPress={handleContinue}
          variant={isValidPhrase ? 'primary' : 'disabled'}
          disabled={!isValidPhrase}
          fullWidth
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: 0,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xxl,
    lineHeight: typography.lineHeights.xl,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: typography.lineHeights.sm,
    paddingHorizontal: spacing.xl,
  },
  inputContainer: {
    width: '100%',
    flex: 1,
    maxHeight: 200,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
});
