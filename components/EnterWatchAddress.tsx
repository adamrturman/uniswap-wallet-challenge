import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, typography } from '../theme';
import { NavigationType } from '../types';
import { truncateAddress } from '../utils/addressUtils';
import Button from './Button';
import Header from './Header';
import ScreenWrapper from './ScreenWrapper';
import AddressInput from './AddressInput';
import { resolveAddress } from '../utils/addressUtils';
import {
  AllTokenBalances,
  createInitialAllTokenBalances,
} from '../utils/balanceUtils';

type EnterWatchAddressProps = {
  onContinue?: (address: string, balances: AllTokenBalances) => void;
};

const ADDRESS_HISTORY_KEY = 'wallet_address_history';
const MAX_HISTORY_ITEMS = 10;

export default function EnterWatchAddress({
  onContinue,
}: EnterWatchAddressProps) {
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
      const history = await AsyncStorage.getItem(ADDRESS_HISTORY_KEY);
      if (history) {
        setAddressHistory(JSON.parse(history));
      }
    } catch (error) {
      throw new Error('Failed to load address history');
    }
  };

  const saveAddressToHistory = async (newAddress: string) => {
    try {
      const trimmedAddress = newAddress.trim();
      const updatedHistory = [
        trimmedAddress,
        ...addressHistory.filter((addr) => addr !== trimmedAddress),
      ].slice(0, MAX_HISTORY_ITEMS);
      setAddressHistory(updatedHistory);
      await AsyncStorage.setItem(
        ADDRESS_HISTORY_KEY,
        JSON.stringify(updatedHistory),
      );
    } catch (error) {
      throw new Error('Failed to save address to history');
    }
  };

  const removeAddressFromHistory = async (addressToRemove: string) => {
    try {
      const updatedHistory = addressHistory.filter(
        (addr) => addr !== addressToRemove,
      );
      setAddressHistory(updatedHistory);
      if (updatedHistory.length === 0) {
        await AsyncStorage.removeItem(ADDRESS_HISTORY_KEY);
      } else {
        await AsyncStorage.setItem(
          ADDRESS_HISTORY_KEY,
          JSON.stringify(updatedHistory),
        );
      }
    } catch (error) {
      throw new Error('Failed to remove address from history');
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
      // Resolve address (handles ENS names)
      const finalAddress = await resolveAddress(trimmedInput);
      if (!finalAddress) {
        return;
      }

      // Save the original input (ENS name or address) to history
      await saveAddressToHistory(trimmedInput);

      // Set initial loading state and navigate immediately
      const initialBalances = createInitialAllTokenBalances();
      onContinue?.(finalAddress, initialBalances);
      navigation.navigate('Portfolio');

      // Clear the input field for when user comes back
      setAddress('');
    } catch (error) {
      throw new Error('Failed to resolve address');
    }
  };

  const handleAddressSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
  };

  const copyAddressToClipboard = async (address: string) => {
    try {
      await Clipboard.setStringAsync(address);
      setCopySuccess(address);
      setTimeout(() => {
        setCopySuccess(null);
      }, 1000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Header
            icon="person"
            text={
              <Text style={[styles.title, { color: colors.text }]}>
                Enter a wallet address
              </Text>
            }
          />

          <View style={styles.inputContainer}>
            <AddressInput
              value={address}
              onChangeText={handleAddressChange}
              onValidationChange={handleValidationChange}
            />

            {addressHistory.length > 0 && (
              <View
                style={[
                  styles.historyContainer,
                  {
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.historyHeader,
                    {
                      borderBottomColor: 'transparent',
                      backgroundColor: 'transparent',
                    },
                  ]}
                  onPress={() => setIsHistoryExpanded(!isHistoryExpanded)}
                >
                  <View style={styles.historyTitleContainer}>
                    <Text
                      style={[
                        styles.historyTitle,
                        {
                          color: colors.textSecondary,
                        },
                      ]}
                    >
                      Recent Addresses
                    </Text>
                    <Ionicons
                      name={isHistoryExpanded ? 'chevron-up' : 'chevron-down'}
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
                      <View
                        style={[
                          styles.historyItem,
                          { borderBottomColor: 'transparent' },
                        ]}
                      >
                        <TouchableOpacity
                          style={styles.historyItemContent}
                          onPress={() => handleAddressSelect(item)}
                        >
                          <Text
                            style={[
                              styles.historyItemText,
                              { color: colors.textSecondary },
                            ]}
                            numberOfLines={1}
                          >
                            {truncateAddress(item)}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.copyButton}
                          onPress={() => copyAddressToClipboard(item)}
                        >
                          <Ionicons
                            name={
                              copySuccess === item
                                ? 'checkmark-circle'
                                : 'copy-outline'
                            }
                            size={16}
                            color={
                              copySuccess === item
                                ? colors.success
                                : colors.textSecondary
                            }
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeAddressFromHistory(item)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={16}
                            color={colors.textSecondary}
                          />
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

        <View
          style={[
            styles.footer,
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
  footer: {
    marginTop: 'auto',
  },
});
