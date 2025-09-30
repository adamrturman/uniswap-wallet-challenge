import React from 'react';
import { render, screen } from '@testing-library/react-native';
import TokenBalance, { TokenBalanceProps } from './TokenBalance';
import { ChainBalance } from '../types';
import { TokenIcon } from './types';
import ethIcon from '../assets/eth-color-icon.png';
// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock the theme context - only what's needed for stylesheet evaluation
jest.mock('../theme', () => ({
  useTheme: () => ({
    colors: { text: '#000', textSecondary: '#666', border: '#ccc' },
  }),
  spacing: { md: 16, sm: 8, xl: 24, xxl: 32 },
  typography: { sizes: { base: 16, sm: 14 }, weights: { normal: '400' } },
}));

// Mock the PriceContext
const mockGetTokenPrice = jest.fn();
const mockGetTokenPriceFormatted = jest.fn();
const mockGetTokenUsdValueFormatted = jest.fn();

jest.mock('../context/PriceContext', () => ({
  usePrice: () => ({
    getTokenPrice: mockGetTokenPrice,
    getTokenPriceFormatted: mockGetTokenPriceFormatted,
    getTokenUsdValueFormatted: mockGetTokenUsdValueFormatted,
  }),
}));

describe('TokenBalance', () => {
  const mockTokenIcon: TokenIcon = {
    baseIcon: ethIcon,
  };

  const defaultProps: TokenBalanceProps = {
    balance: { value: 0, state: 'loaded' },
    tokenName: 'Ethereum',
    tokenSymbol: 'ETH',
    tokenIcon: mockTokenIcon,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetTokenPrice.mockReturnValue(2000);
    mockGetTokenPriceFormatted.mockReturnValue('$2,000.00');
    mockGetTokenUsdValueFormatted.mockReturnValue('$2,000.00');
  });

  describe('Loading State', () => {
    it('should render skeleton when balance state is loading', () => {
      const loadingBalance: ChainBalance = { value: 0, state: 'loading' };

      render(<TokenBalance {...defaultProps} balance={loadingBalance} />);

      // Should not show balance text or error message during loading
      expect(screen.queryByText('0.00 ETH')).toBeNull();
      expect(screen.queryByText('Error loading')).toBeNull();
      // Component should render without errors
      expect(screen.getByText('Ethereum')).toBeTruthy();
    });
  });

  describe('Error State', () => {
    it('should render error message when balance state is error', () => {
      const errorBalance: ChainBalance = { value: 0, state: 'error' };

      render(<TokenBalance {...defaultProps} balance={errorBalance} />);

      expect(screen.getByText('Error loading')).toBeTruthy();
      expect(screen.queryByTestId('skeleton')).toBeNull();
      expect(screen.queryByText('0.00 ETH')).toBeNull();
    });
  });

  describe('Loaded State', () => {
    it('should render zero balance', () => {
      const zeroBalance: ChainBalance = { value: 0, state: 'loaded' };

      render(<TokenBalance {...defaultProps} balance={zeroBalance} />);

      const balanceText = screen.getByText('0.00 ETH');
      expect(balanceText).toBeTruthy();
      expect(screen.queryByTestId('skeleton')).toBeNull();
      expect(screen.queryByText('Error loading')).toBeNull();
    });

    it('should render formatted balance for non-zero amounts', () => {
      const nonZeroBalance: ChainBalance = { value: 1.5, state: 'loaded' };

      render(<TokenBalance {...defaultProps} balance={nonZeroBalance} />);

      expect(screen.getByText('1.5 ETH')).toBeTruthy();
      expect(screen.queryByTestId('skeleton')).toBeNull();
      expect(screen.queryByText('Error loading')).toBeNull();
    });

    it('should render USD value when balance is greater than 0 and price is available', () => {
      const nonZeroBalance: ChainBalance = { value: 1.5, state: 'loaded' };
      mockGetTokenPrice.mockReturnValue(2000);
      mockGetTokenUsdValueFormatted.mockReturnValue('$3,000.00');

      render(<TokenBalance {...defaultProps} balance={nonZeroBalance} />);

      expect(screen.getByText('1.5 ETH')).toBeTruthy();
      expect(screen.getByText('$3,000.00')).toBeTruthy();
    });

    it('should not render USD value when balance is 0', () => {
      const zeroBalance: ChainBalance = { value: 0, state: 'loaded' };
      mockGetTokenPrice.mockReturnValue(2000);

      render(<TokenBalance {...defaultProps} balance={zeroBalance} />);

      expect(screen.getByText('0.00 ETH')).toBeTruthy();
      expect(screen.queryByText('$0.00')).toBeNull();
    });

    it('should not render USD value when price is not available', () => {
      const nonZeroBalance: ChainBalance = { value: 1.5, state: 'loaded' };
      mockGetTokenPrice.mockReturnValue(null);

      render(<TokenBalance {...defaultProps} balance={nonZeroBalance} />);

      expect(screen.getByText('1.5 ETH')).toBeTruthy();
      expect(screen.queryByText('$3,000.00')).toBeNull();
    });

    it('should format large numbers with commas correctly', () => {
      const largeBalance: ChainBalance = { value: 1234567.89, state: 'loaded' };

      render(<TokenBalance {...defaultProps} balance={largeBalance} />);

      expect(screen.getByText('1,234,567.89 ETH')).toBeTruthy();
    });

    it('should handle decimal amounts with proper formatting', () => {
      const decimalBalance: ChainBalance = { value: 0.1234, state: 'loaded' };

      render(<TokenBalance {...defaultProps} balance={decimalBalance} />);

      expect(screen.getByText('0.1234 ETH')).toBeTruthy();
    });
  });

  describe('Token Information Display', () => {
    it('should display token name correctly', () => {
      render(<TokenBalance {...defaultProps} />);

      expect(screen.getByText('Ethereum')).toBeTruthy();
    });

    it('should display token price when available', () => {
      mockGetTokenPrice.mockReturnValue(2000);
      mockGetTokenPriceFormatted.mockReturnValue('$2,000.00');

      render(<TokenBalance {...defaultProps} />);

      expect(screen.getByText('$2,000.00')).toBeTruthy();
    });

    it('should not display token price when not available', () => {
      mockGetTokenPrice.mockReturnValue(null);

      render(<TokenBalance {...defaultProps} />);

      expect(screen.queryByText('$2,000.00')).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small decimal amounts', () => {
      const smallBalance: ChainBalance = { value: 0.0001, state: 'loaded' };

      render(<TokenBalance {...defaultProps} balance={smallBalance} />);

      expect(screen.getByText('0.0001 ETH')).toBeTruthy();
    });

    it('should handle very large balances', () => {
      const largeBalance: ChainBalance = {
        value: 999999999.9999,
        state: 'loaded',
      };

      render(<TokenBalance {...defaultProps} balance={largeBalance} />);

      expect(screen.getByText('999,999,999.9999 ETH')).toBeTruthy();
    });
  });
});
