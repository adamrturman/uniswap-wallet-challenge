import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  View,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Wallet } from 'ethers';
import { useTheme, spacing, typography } from '../theme';
import { NavigationType } from '../types';
import Button from './Button';
import BackButton from './BackButton';
import Header from './Header';
import HeaderIcon from './HeaderIcon';

type EnterRecoveryPhraseProps = {
  onContinue?: (phrase: string) => void;
};

export default function EnterRecoveryPhrase({ onContinue }: EnterRecoveryPhraseProps) {
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

  // If a user has entered something but it's not valid
  const showError = phrase.trim().length > 0 && !isValidPhrase;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Header
          icon={<HeaderIcon name="document-text" library="ionicons" size="large" />}
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

        {/* Input field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.background,
                borderColor: showError ? colors.error : colors.border,
                color: colors.text
              }
            ]}
            placeholder="Type or paste your recovery phrase"
            placeholderTextColor={colors.textSecondary}
            value={phrase}
            onChangeText={handlePhraseChange}
            multiline
            textAlignVertical="top"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          {/* Error message */}
          {showError && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              Invalid recovery phrase. Please check and try again.
            </Text>
          )}
        </View>
      </View>

      {/* Continue button */}
      <View style={[styles.buttonContainer, { 
        paddingHorizontal: spacing.xl, 
        paddingBottom: spacing.xl * 2, 
        paddingTop: spacing.xl 
      }]}>
        <Button
          title="Continue"
          onPress={handleContinue}
          variant={isValidPhrase ? 'primary' : 'disabled'}
          disabled={!isValidPhrase}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: 0,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xxl,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 22,
    paddingHorizontal: spacing.xl,
  },
  inputContainer: {
    width: '100%',
    flex: 1,
    maxHeight: 200,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    maxHeight: 200,
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  buttonContainer: {
    // Spacing will be applied via theme values
  },
});