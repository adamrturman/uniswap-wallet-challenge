import { formatPrice, calculateUsdValue, formatUsdValue } from './priceUtils';

describe('priceUtils', () => {
  describe('formatPrice', () => {
    it('should format positive prices correctly', () => {
      expect(formatPrice(100)).toBe('$100.00');
      expect(formatPrice(100.5)).toBe('$100.50');
      expect(formatPrice(100.99)).toBe('$100.99');
    });

    it('should format large numbers with commas', () => {
      expect(formatPrice(1000)).toBe('$1,000.00');
      expect(formatPrice(1000000)).toBe('$1,000,000.00');
      expect(formatPrice(1234567.89)).toBe('$1,234,567.89');
    });

    it('should format zero correctly', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('should format negative prices correctly', () => {
      expect(formatPrice(-100)).toBe('$-100.00');
      expect(formatPrice(-100.5)).toBe('$-100.50');
    });

    it('should handle very small decimal values', () => {
      expect(formatPrice(0.01)).toBe('$0.01');
      expect(formatPrice(0.001)).toBe('$0.00');
    });

    it('should handle very large decimal values', () => {
      expect(formatPrice(999999.999)).toBe('$1,000,000.00');
    });
  });

  describe('formatUsdValue', () => {
    it('should format USD values correctly', () => {
      expect(formatUsdValue(100)).toBe('$100.00');
      expect(formatUsdValue(100.5)).toBe('$100.50');
      expect(formatUsdValue(100.99)).toBe('$100.99');
    });

    it('should format large USD values with commas', () => {
      expect(formatUsdValue(1000)).toBe('$1,000.00');
      expect(formatUsdValue(1000000)).toBe('$1,000,000.00');
      expect(formatUsdValue(1234567.89)).toBe('$1,234,567.89');
    });

    it('should format zero correctly', () => {
      expect(formatUsdValue(0)).toBe('$0.00');
    });

    it('should handle very small decimal values', () => {
      expect(formatUsdValue(0.01)).toBe('$0.01');
      expect(formatUsdValue(0.001)).toBe('$0.00');
    });

    it('should handle very large decimal values', () => {
      expect(formatUsdValue(999999.999)).toBe('$1,000,000.00');
    });
  });
});
