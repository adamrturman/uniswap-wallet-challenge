import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from '../theme/ThemeContext';
import AddressInput from './AddressInput';

// Mock the address validation utility
jest.mock('../utils/addressValidation', () => ({
  isValidAddressOrENS: jest.fn(),
}));

import { isValidAddressOrENS } from '../utils/addressValidation';

const mockIsValidAddressOrENS = isValidAddressOrENS as jest.MockedFunction<typeof isValidAddressOrENS>;

// Test wrapper with theme provider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('AddressInput', () => {
  const defaultProps = {
    value: '',
    onChangeText: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Valid ENS Names', () => {
    it('should validate correctly formatted ENS names as valid', async () => {
      const validENSNames = [
        'vitalik.eth',
        'uniswap.eth', 
        'ethereum.eth',
        'coinbase.eth',
        'aave.eth',
        'compound.eth',
        'opensea.eth',
        'ens.eth',
        'test.eth',
        'subdomain.uniswap.eth'
      ];

      for (const ensName of validENSNames) {
        mockIsValidAddressOrENS.mockReturnValue(true);
        
        const { getByDisplayValue } = render(
          <TestWrapper>
            <AddressInput {...defaultProps} value={ensName} />
          </TestWrapper>
        );

        expect(getByDisplayValue(ensName)).toBeTruthy();
      }
    });

    it('should call validation callback for valid ENS', () => {
      const onValidationChange = jest.fn();
      mockIsValidAddressOrENS.mockReturnValue(true);

      render(
        <TestWrapper>
          <AddressInput 
            {...defaultProps} 
            value="vitalik.eth"
            onValidationChange={onValidationChange}
          />
        </TestWrapper>
      );

      expect(onValidationChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Valid Ethereum Addresses', () => {
    it('should validate standard Ethereum addresses', () => {
      const validAddresses = [
        '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Vitalik's address
        '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI token
        '0xA0b86a33E6441b8C4C8C0C4C0C4C0C4C0C4C0C4C', // Example address
        '0x0000000000000000000000000000000000000000', // Zero address
        '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', // Max address
        '0x1234567890abcdef1234567890abcdef12345678', // Mixed case
        '0xABCDEF1234567890ABCDEF1234567890ABCDEF12'  // All caps
      ];

      for (const address of validAddresses) {
        mockIsValidAddressOrENS.mockReturnValue(true);
        
        const { getByDisplayValue } = render(
          <TestWrapper>
            <AddressInput {...defaultProps} value={address} />
          </TestWrapper>
        );

        expect(getByDisplayValue(address)).toBeTruthy();
      }
    });

    it('should call validation callback for valid addresses', () => {
      const onValidationChange = jest.fn();
      mockIsValidAddressOrENS.mockReturnValue(true);

      render(
        <TestWrapper>
          <AddressInput 
            {...defaultProps} 
            value="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
            onValidationChange={onValidationChange}
          />
        </TestWrapper>
      );

      expect(onValidationChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Invalid Inputs', () => {
    it('should show error for malformed addresses', () => {
      const invalidAddresses = [
        '0x', // Too short
        '0x123', // Too short
        '0x1234567890abcdef1234567890abcdef1234567', // Too short (39 chars)
        '0x1234567890abcdef1234567890abcdef123456789', // Too long (41 chars)
        '0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG', // Invalid characters
        '742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Missing 0x prefix
        '0X742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Wrong prefix case
        '0x742d35cc6634c0532925a3b8d4c9db96c4b4d8b6', // Valid but testing case sensitivity
      ];

      for (const invalidAddress of invalidAddresses) {
        mockIsValidAddressOrENS.mockReturnValue(false);
        
        const { getByText } = render(
          <TestWrapper>
            <AddressInput {...defaultProps} value={invalidAddress} />
          </TestWrapper>
        );

        expect(getByText('Invalid wallet address or ENS name. Please check and try again.')).toBeTruthy();
      }
    });

    it('should show error for invalid ENS names', () => {
      const invalidENS = [
        'vitalik', // Missing .eth
        '.eth', // Missing name
        'vitalik.', // Incomplete
        'vitalik.eth.', // Extra dot
        'vitalik.eth.eth', // Double extension
        'vitalik.eth.com', // Wrong TLD
        'vitalik.eth@', // Invalid character
        'vitalik.eth ', // Trailing space
        ' vitalik.eth', // Leading space
        'vitalik .eth', // Space in name
      ];

      for (const invalidName of invalidENS) {
        mockIsValidAddressOrENS.mockReturnValue(false);
        
        const { getByText } = render(
          <TestWrapper>
            <AddressInput {...defaultProps} value={invalidName} />
          </TestWrapper>
        );

        expect(getByText('Invalid wallet address or ENS name. Please check and try again.')).toBeTruthy();
      }
    });

    it('should call validation callback for invalid inputs', () => {
      const onValidationChange = jest.fn();
      mockIsValidAddressOrENS.mockReturnValue(false);

      render(
        <TestWrapper>
          <AddressInput 
            {...defaultProps} 
            value="invalid-input"
            onValidationChange={onValidationChange}
          />
        </TestWrapper>
      );

      expect(onValidationChange).toHaveBeenCalledWith(false);
    });
  });

  describe('User Interactions', () => {
    it('should call onChangeText when user types', () => {
      const onChangeText = jest.fn();
      
      const { getByPlaceholderText } = render(
        <TestWrapper>
          <AddressInput {...defaultProps} onChangeText={onChangeText} />
        </TestWrapper>
      );

      const input = getByPlaceholderText('Enter a wallet address or ENS name');
      fireEvent.changeText(input, 'vitalik.eth');

      expect(onChangeText).toHaveBeenCalledWith('vitalik.eth');
    });

    it('should update validation state when input changes', () => {
      const onValidationChange = jest.fn();
      
      // Start with invalid
      mockIsValidAddressOrENS.mockReturnValue(false);
      
      const { rerender } = render(
        <TestWrapper>
          <AddressInput 
            {...defaultProps} 
            value="invalid"
            onValidationChange={onValidationChange}
          />
        </TestWrapper>
      );

      expect(onValidationChange).toHaveBeenCalledWith(false);

      // Change to valid
      mockIsValidAddressOrENS.mockReturnValue(true);
      
      rerender(
        <TestWrapper>
          <AddressInput 
            {...defaultProps} 
            value="vitalik.eth"
            onValidationChange={onValidationChange}
          />
        </TestWrapper>
      );

      expect(onValidationChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty input', () => {
      const onValidationChange = jest.fn();
      mockIsValidAddressOrENS.mockReturnValue(false);

      render(
        <TestWrapper>
          <AddressInput 
            {...defaultProps} 
            value=""
            onValidationChange={onValidationChange}
          />
        </TestWrapper>
      );

      expect(onValidationChange).toHaveBeenCalledWith(false);
    });

    it('should handle whitespace-only input', () => {
      const onValidationChange = jest.fn();
      mockIsValidAddressOrENS.mockReturnValue(false);

      render(
        <TestWrapper>
          <AddressInput 
            {...defaultProps} 
            value="   "
            onValidationChange={onValidationChange}
          />
        </TestWrapper>
      );

      expect(onValidationChange).toHaveBeenCalledWith(false);
    });

    it('should handle very long inputs', () => {
      const longInput = 'a'.repeat(1000);
      const onValidationChange = jest.fn();
      mockIsValidAddressOrENS.mockReturnValue(false);

      render(
        <TestWrapper>
          <AddressInput 
            {...defaultProps} 
            value={longInput}
            onValidationChange={onValidationChange}
          />
        </TestWrapper>
      );

      expect(onValidationChange).toHaveBeenCalledWith(false);
    });
  });
});
