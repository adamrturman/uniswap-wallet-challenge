import React, { useMemo, useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ethers, Wallet } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, typography } from '../theme';
import { NavigationType } from '../types';
import Button from './Button';
import BackButton from './BackButton';
import Header from './Header';
import Input from './Input';
import LogoutButton from './LogoutButton';

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
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  const isValid = useMemo(() => ethers.utils.isAddress(address), [address]);

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

  const handleContinue = async () => {
    if (!isValid) return;

    const trimmedAddress = address.trim();
    setAddress(trimmedAddress);

    // Save address to history
    await saveAddressToHistory(trimmedAddress);

    // Call the continue handler
    onContinue?.(trimmedAddress);
    
    // Navigate to SelectToken screen
    navigation.navigate('SelectToken');
    
    // Clear the input field for when user comes back
    setAddress('');
  };

  const handleAddressSelect = async (selectedAddress: string) => {
    setAddress(selectedAddress);
    
    // Save address to history (move to top)
    await saveAddressToHistory(selectedAddress);

    // Call the continue handler
    onContinue?.(selectedAddress);
    
    // Navigate to SelectToken screen
    navigation.navigate('SelectToken');
    
    // Clear the input field for when user comes back
    setAddress('');
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 30) return address;
    return `${address.slice(0, 15)}...${address.slice(-12)}`;
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          {wallet && onLogout && (
            <LogoutButton onPress={onLogout} />
          )}
        </View>

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
            <Input
              value={address}
              onChangeText={setAddress}
              placeholder="Type or paste recipient address"
              isValid={isValid}
              errorMessage="Invalid wallet address. Please check and try again."
            />
            
            {addressHistory.length > 0 && (
              <View style={[styles.historyContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TouchableOpacity
                  style={[styles.historyHeader, { borderBottomColor: colors.border }]}
                  onPress={() => setIsHistoryExpanded(!isHistoryExpanded)}
                >
                  <Text style={[styles.historyTitle, { color: colors.text }]}>Recent Recipients</Text>
                  <Ionicons 
                    name={isHistoryExpanded ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={colors.text} 
                  />
                </TouchableOpacity>
                {isHistoryExpanded && (
                  <FlatList
                    data={addressHistory}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    renderItem={({ item }) => (
                      <View style={[styles.historyItem, { borderBottomColor: colors.border }]}>
                        <TouchableOpacity
                          style={styles.historyItemContent}
                          onPress={() => handleAddressSelect(item)}
                        >
                          <Text style={[styles.historyItemText, { color: colors.text }]} numberOfLines={1}>
                            {truncateAddress(item)}
                          </Text>
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
            variant={isValid ? 'primary' : 'disabled'}
            disabled={!isValid}
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
    justifyContent: 'space-between',
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
  footer: {
    marginTop: 'auto',
  },
  historyContainer: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  historyTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
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
  removeButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
});
