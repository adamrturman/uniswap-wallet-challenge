import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Wallet } from 'ethers';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome6 } from '@expo/vector-icons';
import { ChainKey, chainOrder, TokenKey } from '../config/chain';
import { useTheme, spacing, typography } from '../theme';
import { NavigationType } from '../types';
import Button from './Button';
import Header from './Header';
import HeaderIcon from './HeaderIcon';
import ChainSelectorGroup from './ChainSelectorGroup';
import TokenBalance from './TokenBalance';
import ScreenWrapper from './ScreenWrapper';
import { AllTokenBalances, getTokensWithBalances } from '../utils/balanceUtils';
import { usePrice } from '../context/PriceContext';

export type PortfolioProps = {
  address: string;
  balances: AllTokenBalances;
  wallet?: Wallet | null;
  onLogout?: () => void;
};

function truncateAddress(addr: string) {
  const v = addr.trim();
  return `${v.slice(0, 8)}...${v.slice(-8)}`;
}

export default function Portfolio({ address, balances, wallet, onLogout }: PortfolioProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();
  const { getTokenUsdValue } = usePrice();
  const [selected, setSelected] = useState<'all' | 'active' | ChainKey>('all');
  const [sortByUsd, setSortByUsd] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Create a unique storage key for this user's profile image
  const profileImageKey = `profile_image_${address}`;

  // Load profile image from AsyncStorage on component mount
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const savedImage = await AsyncStorage.getItem(profileImageKey);
        if (savedImage) {
          setProfileImage(savedImage);
        }
      } catch (error) {
        console.error('Error loading profile image:', error);
      }
    };

    loadProfileImage();
  }, [profileImageKey]);

  // Save profile image to AsyncStorage
  const saveProfileImage = async (imageUri: string) => {
    try {
      await AsyncStorage.setItem(profileImageKey, imageUri);
    } catch (error) {
      console.error('Error saving profile image:', error);
    }
  };

  // Clear profile image from AsyncStorage
  const clearProfileImage = async () => {
    try {
      await AsyncStorage.removeItem(profileImageKey);
      setProfileImage(null);
    } catch (error) {
      console.error('Error clearing profile image:', error);
    }
  };

  // Removed automatic balance refetching on focus to prevent 429 errors

  const handleSendTransaction = () => {
    if (!wallet) {
      Alert.alert('Error', 'Wallet not available');
      return;
    }

    // Navigate to EnterRecipientAddress screen
    navigation.navigate('EnterRecipientAddress');
  };

  const handleCopyAddress = async () => {
    try {
      await Clipboard.setStringAsync(address);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const handleImagePicker = async () => {
    try {
      // Request permission to access media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        await saveProfileImage(imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };


  const orderedKeys = useMemo(() => chainOrder, []);

  // Create a list of all tokens (native + ERC-20) with their balance states
  const allTokens = useMemo(() => {
    const tokens: Array<{
      chainKey: ChainKey;
      tokenKey: TokenKey;
      name: string;
      symbol: string;
      balance: number;
      balanceState: 'loading' | 'loaded' | 'error';
      chainIcon: any;
      tokenIcon: any;
      usdValue?: number;
    }> = [];

    // Handle active balances filtering
    if (selected === 'active') {
      const activeTokens = getTokensWithBalances(balances);
      const chainConfig = require('../config/chain').chainConfig;
      const tokenConfig = require('../config/chain').tokenConfig;
      
      const mappedTokens = activeTokens.map(token => {
        const usdValue = getTokenUsdValue(token.symbol, token.balance);
        return {
          chainKey: token.chainKey,
          tokenKey: token.tokenKey,
          name: token.name,
          symbol: token.symbol,
          balance: token.balance,
          balanceState: 'loaded' as const,
          chainIcon: chainConfig[token.chainKey].chainIcon,
          tokenIcon: token.tokenIcon,
          usdValue: usdValue || 0,
        };
      });

      // Apply USD sorting to active tokens if enabled
      if (sortByUsd) {
        return [...mappedTokens].sort((a, b) => (b.usdValue || 0) - (a.usdValue || 0));
      }

      return mappedTokens;
    }

    const keys = selected === 'all' ? orderedKeys : orderedKeys.filter((k) => k === selected);
    
    
    keys.forEach((chainKey) => {
      const chainBalances = balances[chainKey];
      if (!chainBalances) return;

      const chainConfig = require('../config/chain').chainConfig;
      const config = chainConfig[chainKey];

      // Add native token (always show, regardless of balance)
      const nativeBalance = chainBalances.native?.value || 0;
      const nativeUsdValue = getTokenUsdValue(config.symbol, nativeBalance);
      
      tokens.push({
        chainKey,
        tokenKey: config.symbol as TokenKey,
        name: config.nativeTokenDisplay,
        symbol: config.symbol,
        balance: nativeBalance,
        balanceState: chainBalances.native?.state || 'loading',
        chainIcon: config.chainIcon,
        tokenIcon: config.nativeTokenIcon,
        usdValue: nativeUsdValue || 0,
      });

      // Add ERC-20 tokens (show all, regardless of balance)
      if (chainBalances.tokens) {
        const tokenConfig = require('../config/chain').tokenConfig;
        // Get available tokens for this chain
        const availableTokens = Object.keys(tokenConfig[chainKey]) as TokenKey[];
        const tokenKeys: TokenKey[] = availableTokens;
        
        tokenKeys.forEach((tokenKey) => {
          const tokenBalance = chainBalances.tokens[tokenKey];
          const token = tokenConfig[chainKey][tokenKey];
          if (token) {
            const balance = tokenBalance?.value || 0;
            const usdValue = getTokenUsdValue(token.symbol, balance);
            
            tokens.push({
              chainKey,
              tokenKey,
              name: token.name,
              symbol: token.symbol,
              balance,
              balanceState: tokenBalance?.state || 'loading',
              chainIcon: chainConfig[chainKey].chainIcon,
              tokenIcon: token.icon,
              usdValue: usdValue || 0,
            });
          }
        });
      }
    });

    // Sort by USD value if enabled
    if (sortByUsd) {
      return [...tokens].sort((a, b) => (b.usdValue || 0) - (a.usdValue || 0));
    }

    return tokens;
  }, [orderedKeys, selected, balances, sortByUsd, getTokenUsdValue]);

  return (
    <ScreenWrapper 
      showLogoutButton={!!(wallet && onLogout)}
      onLogout={onLogout}
    >

      <View style={styles.addressCard}>
        <Header
          icon="wallet"
          text={
            <View style={styles.addressContainer}>
              <Text style={[styles.addressText, { color: colors.text }]}>
                {truncateAddress(address)}
              </Text>
              <TouchableOpacity
                onPress={handleCopyAddress}
                style={styles.copyButton}
                activeOpacity={0.7}
              >
                <FontAwesome6
                  name={copySuccess ? "circle-check" : "copy"}
                  size={12}
                  color={copySuccess ? colors.success : colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          }
          onPress={handleImagePicker}
          profileImage={profileImage}
        />
      </View>

      <ChainSelectorGroup
        selected={selected}
        onSelectionChange={setSelected}
      />

      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortByUsd(!sortByUsd)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.sortButtonText,
            { color: colors.textSecondary }
          ]}>
            {sortByUsd ? 'USD Value ↑' : 'USD Value ↓'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {allTokens.map((token) => (
          <TokenBalance
            key={`${token.chainKey}-${token.tokenKey}`}
            balance={{ value: token.balance, state: token.balanceState }}
            tokenName={token.name}
            tokenSymbol={token.symbol}
            tokenIcon={token.tokenIcon}
          />
        ))}
      </ScrollView>

      {/* Send button - only show if wallet is available */}
      {wallet && (
        <View style={[{ 
          paddingHorizontal: spacing.xl, 
          paddingBottom: spacing.xl * 2, 
          paddingTop: spacing.xl 
        }]}>
          <Button
            title="Send"
            onPress={handleSendTransaction}
            variant="primary"
            fullWidth
          />
        </View>
      )}
    </ScreenWrapper>
  );
}


const styles = StyleSheet.create({
  addressCard: {
    marginTop: 0,
    marginHorizontal: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
  addressText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    marginRight: spacing.sm,
  },
  copyButton: {
    padding: 0,
  },
  list: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  sortContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xs,
    alignItems: 'flex-start',
  },
  sortButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortButtonText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.normal,
  },

});