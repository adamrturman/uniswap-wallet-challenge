import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADDRESS_HISTORY_KEY = 'wallet_address_history';
const MAX_HISTORY_ITEMS = 10;

export function useAddressHistory() {
  const [addressHistory, setAddressHistory] = useState<string[]>([]);

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
      console.error('Failed to load address history:', error);
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
      console.error('Failed to save address to history:', error);
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
      console.error('Failed to remove address from history:', error);
    }
  };

  return {
    addressHistory,
    saveAddressToHistory,
    removeAddressFromHistory,
  };
}
