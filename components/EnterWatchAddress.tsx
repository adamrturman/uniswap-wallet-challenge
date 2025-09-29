import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, typography } from '../theme';
import { NavigationType } from '../types';
import Button from './Button';
import BackButton from './BackButton';
import Header from './Header';
import AddressInput, { useAddressResolution } from './AddressInput';
import { AllTokenBalances, createInitialAllTokenBalances } from '../utils/balanceUtils';

type EnterWatchAddressProps = {
  onContinue?: (address: string, balances: AllTokenBalances) => void;
};

const ADDRESS_HISTORY_KEY = 'wallet_address_history';
const MAX_HISTORY_ITEMS = 10;

export default function EnterWatchAddress({ onContinue }: EnterWatchAddressProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();
  const [address, setAddress] = useState('');
  const [addressHistory, setAddressHistory] = useState<string[]>([]);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const { resolveAddress } = useAddressResolution();

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
      console.log('Failed to load address history:', error);
    }
  };

  const saveAddressToHistory = async (newAddress: string) => {
    try {
      const trimmedAddress = newAddress.trim();
      const updatedHistory = [trimmedAddress, ...addressHistory.filter(addr => addr !== trimmedAddress)].slice(0, MAX_HISTORY_ITEMS);
      setAddressHistory(updatedHistory);
      await AsyncStorage.setItem(ADDRESS_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.log('Failed to save address to history:', error);
    }
  };

  const clearAddressHistory = async () => {
    try {
      setAddressHistory([]);
      await AsyncStorage.removeItem(ADDRESS_HISTORY_KEY);
    } catch (error) {
      console.log('Failed to clear address history:', error);
    }
  };

  const removeAddressFromHistory = async (addressToRemove: string) => {
    try {
      const updatedHistory = addressHistory.filter(addr => addr !== addressToRemove);
      setAddressHistory(updatedHistory);
      if (updatedHistory.length === 0) {
        await AsyncStorage.removeItem(ADDRESS_HISTORY_KEY);
      } else {
        await AsyncStorage.setItem(ADDRESS_HISTORY_KEY, JSON.stringify(updatedHistory));
      }
    } catch (error) {
      console.log('Failed to remove address from history:', error);
    }
  };


  const handleContinue = async () => {
    if (!address.trim()) return;

    const trimmedInput = address.trim();
    setAddress(trimmedInput);

    try {
      // Resolve address (handles ENS names)
      const finalAddress = await resolveAddress(trimmedInput);
      if (!finalAddress) {
        console.log('Failed to resolve address');
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
      console.log('Failed to resolve address:', error);
    }
  };

  const handleAddressSelect = async (selectedAddress: string) => {
    setAddress(selectedAddress);
    
    try {
      // Resolve address (handles ENS names)
      const finalAddress = await resolveAddress(selectedAddress);
      if (!finalAddress) {
        console.log('Failed to resolve address');
        return;
      }
      
      // Save address to history (move to top)
      await saveAddressToHistory(selectedAddress);
      
      // Set initial loading state and navigate immediately
      const initialBalances = createInitialAllTokenBalances();
      onContinue?.(finalAddress, initialBalances);
      navigation.navigate('Portfolio');
      
      // Clear the input field for when user comes back
      setAddress('');
    } catch (error) {
      console.log('Failed to resolve address:', error);
    }
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 30) return address;
    return `${address.slice(0, 12)}...${address.slice(-10)}`;
  };

  const copyAddressToClipboard = async (address: string) => {
    try {
      await Clipboard.setStringAsync(address);
      // You could add a toast notification here if desired
      console.log('Address copied to clipboard:', address);
    } catch (error) {
      console.log('Failed to copy address to clipboard:', error);
    }
  };


  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>

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
              onChangeText={setAddress}
              placeholder="Enter a wallet address or ENS name"
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
                    ]}>View Recent Addresses</Text>
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
                          <Ionicons name="copy-outline" size={16} color={colors.textSecondary} />
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
            variant={address.trim() ? 'primary' : 'disabled'}
            disabled={!address.trim()}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
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
    maxHeight: 200,
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
    maxHeight: 150,
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