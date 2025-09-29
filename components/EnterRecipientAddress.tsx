import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { Wallet, ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, typography } from '../theme';
import { NavigationType } from '../types';
import { truncateAddress } from '../utils/addressUtils';
import Button from './Button';
import Header from './Header';
import AddressInput, { resolveAddress } from './AddressInput';
import ScreenWrapper from './ScreenWrapper';

type EnterRecipientAddressProps = {
  onContinue?: (address: string) => void;
  onLogout?: () => void;
  wallet?: Wallet | null;
};

const RECIPIENT_HISTORY_KEY = 'recipient_address_history';
const MAX_HISTORY_ITEMS = 10;

export default function EnterRecipientAddress({ onContinue, onLogout, wallet }: EnterRecipientAddressProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();
  const [address, setAddress] = useState('');
  const [addressHistory, setAddressHistory] = useState<string[]>([]);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [isValidAddress, setIsValidAddress] = useState(false);

  // Load address history on component mount
  useEffect(() => {
    loadAddressHistory();
  }, []);

  const loadAddressHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(RECIPIENT_HISTORY_KEY);
      if (history) {
        setAddressHistory(JSON.parse(history));
      }
    } catch (error) {
      console.log('Failed to load recipient address history:', error);
    }
  };

  const saveAddressToHistory = async (newAddress: string) => {
    try {
      const trimmedAddress = newAddress.trim();
      const updatedHistory = [trimmedAddress, ...addressHistory.filter(addr => addr !== trimmedAddress)].slice(0, MAX_HISTORY_ITEMS);
      setAddressHistory(updatedHistory);
      await AsyncStorage.setItem(RECIPIENT_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.log('Failed to save recipient address to history:', error);
    }
  };

  const removeAddressFromHistory = async (addressToRemove: string) => {
    try {
      const updatedHistory = addressHistory.filter(addr => addr !== addressToRemove);
      setAddressHistory(updatedHistory);
      if (updatedHistory.length === 0) {
        await AsyncStorage.removeItem(RECIPIENT_HISTORY_KEY);
      } else {
        await AsyncStorage.setItem(RECIPIENT_HISTORY_KEY, JSON.stringify(updatedHistory));
      }
    } catch (error) {
      console.log('Failed to remove recipient address from history:', error);
    }
  };

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
  };

  const handleValidationChange = (isValid: boolean) => {
    setIsValidAddress(isValid);
  };

  const handleContinue = async () => {
    if (!address.trim() || !isValidAddress) return;

    const trimmedInput = address.trim();
    setAddress(trimmedInput);

    try {
      const finalAddress = await resolveAddress(trimmedInput);
      if (!finalAddress) {
        console.log('Failed to resolve address');
        return;
      }
      
      // Save the original input (ENS name or address) to history
      await saveAddressToHistory(trimmedInput);

      // Call the continue handler with the resolved address
      onContinue?.(finalAddress);
      
      // Navigate to SelectToken screen
      navigation.navigate('SelectToken');
      
      // Clear the input field for when user comes back
      setAddress('');
    } catch (error) {
      console.log('Failed to process address:', error);
    }
  };

  const handleAddressSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
  };


  const copyAddressToClipboard = async (address: string) => {
    try {
      await Clipboard.setString(address);
      setCopySuccess(address);
      setTimeout(() => {
        setCopySuccess(null);
      }, 1000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  return (
    <ScreenWrapper 
      showLogoutButton={!!(wallet && onLogout)}
      onLogout={onLogout}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >

        <View style={styles.content}>
          <Header
            icon="person"
            text={
              <Text style={[styles.title, { color: colors.text }]}>
                Enter recipient address
              </Text>
            }
          />

          <View style={styles.inputContainer}>
            <AddressInput
              value={address}
              onChangeText={handleAddressChange}
              placeholder="Enter a wallet address or ENS name"
              onValidationChange={handleValidationChange}
            />
            
            {addressHistory.length > 0 && (
              <View style={[
                styles.historyContainer, 
                { 
                  backgroundColor: 'transparent',
                  borderColor: 'transparent'
                }
              ]}>
                <TouchableOpacity
                  style={[
                    styles.historyHeader, 
                    { 
                      borderBottomColor: 'transparent',
                      backgroundColor: 'transparent'
                    }
                  ]}
                  onPress={() => setIsHistoryExpanded(!isHistoryExpanded)}
                >
                  <View style={styles.historyTitleContainer}>
                    <Text style={[
                      styles.historyTitle, 
                      { 
                        color: colors.textSecondary
                      }
                    ]}>Recent Recipients</Text>
                    <Ionicons 
                      name={isHistoryExpanded ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color={colors.textSecondary} 
                      style={styles.chevronIcon}
                    />
                  </View>
                </TouchableOpacity>
                {isHistoryExpanded && (
                  <FlatList
                    data={addressHistory}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    renderItem={({ item }) => (
                      <View style={[styles.historyItem, { borderBottomColor: 'transparent' }]}>
                        <TouchableOpacity
                          style={styles.historyItemContent}
                          onPress={() => handleAddressSelect(item)}
                        >
                          <Text style={[styles.historyItemText, { color: colors.textSecondary }]} numberOfLines={1}>
                            {truncateAddress(item)}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.copyButton}
                          onPress={() => copyAddressToClipboard(item)}
                        >
                          <Ionicons 
                            name={copySuccess === item ? "checkmark-circle" : "copy-outline"} 
                            size={16} 
                            color={copySuccess === item ? colors.success : colors.textSecondary} 
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeAddressFromHistory(item)}
                        >
                          <Ionicons name="trash-outline" size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    )}
                    style={styles.historyList}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>
            )}
          </View>
        </View>

        <View style={[styles.footer, { 
          paddingHorizontal: spacing.xl, 
          paddingBottom: spacing.xl * 2, 
          paddingTop: spacing.xl 
        }]}>
          <Button
            title="Continue"
            onPress={handleContinue}
            variant={isValidAddress ? 'primary' : 'disabled'}
            disabled={!isValidAddress}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    marginTop: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xxl,
    lineHeight: typography.lineHeights.xl,
  },
  inputContainer: {
    width: '100%',
    marginTop: spacing.lg,
  },
  footer: {
    marginTop: 'auto',
  },
  historyContainer: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 300,
    overflow: 'hidden',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  historyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  chevronIcon: {
    marginLeft: spacing.xs,
  },
  historyList: {
    maxHeight: 250,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemText: {
    fontSize: typography.sizes.sm,
    fontFamily: 'monospace',
  },
  copyButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  removeButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
});
