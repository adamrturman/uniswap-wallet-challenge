import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Wallet } from 'ethers';
import { useTheme } from '../theme';

type EnterRecoveryPhraseProps = {
  onBack?: () => void;
  onContinue?: (phrase: string) => void;
};

export default function EnterRecoveryPhrase({ onBack, onContinue }: EnterRecoveryPhraseProps) {
  const { colors } = useTheme();
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
    }
  };

  // Determine if we should show an error
  const showError = phrase.trim().length > 0 && !isValidPhrase;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={[styles.backArrow, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.icon, { color: colors.text }]}>📄</Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          Enter your recovery phrase
        </Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your recovery phrase will only be stored locally on your device.
        </Text>

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
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            { 
              backgroundColor: colors.primary,
              opacity: isValidPhrase ? 1 : 0.5
            }
          ]} 
          onPress={handleContinue}
          activeOpacity={0.85}
          disabled={!isValidPhrase}
        >
          <Text style={[styles.continueButtonText, { color: colors.textInverse }]}>
            Continue
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 24,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  continueButton: {
    width: '100%',
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
});