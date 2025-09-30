import { formatTokenAmount } from './balanceUtils';

describe('formatTokenAmount', () => {
  it('should return "0.00" for zero amount', () => {
    expect(formatTokenAmount(0)).toBe('0.00');
  });

  it('should format positive integers correctly', () => {
    expect(formatTokenAmount(1)).toBe('1');
    expect(formatTokenAmount(100)).toBe('100');
    expect(formatTokenAmount(1000)).toBe('1,000');
    expect(formatTokenAmount(1000000)).toBe('1,000,000');
  });

  it('should format positive decimals correctly with up to 4 decimal places', () => {
    expect(formatTokenAmount(1.5)).toBe('1.5');
    expect(formatTokenAmount(1.25)).toBe('1.25');
    expect(formatTokenAmount(1.1234)).toBe('1.1234');
    expect(formatTokenAmount(1.12345)).toBe('1.1235'); // Rounds to 4 decimal places
    expect(formatTokenAmount(1.123456)).toBe('1.1235'); // Rounds to 4 decimal places
  });

  it('should format large numbers with commas', () => {
    expect(formatTokenAmount(1234567.89)).toBe('1,234,567.89');
    expect(formatTokenAmount(999999.9999)).toBe('999,999.9999');
  });

  it('should handle very small decimal amounts', () => {
    expect(formatTokenAmount(0.0001)).toBe('0.0001');
    expect(formatTokenAmount(0.00001)).toBe('0');
    expect(formatTokenAmount(0.000001)).toBe('0');
  });

  it('should handle negative numbers', () => {
    expect(formatTokenAmount(-1)).toBe('-1');
    expect(formatTokenAmount(-1.5)).toBe('-1.5');
    expect(formatTokenAmount(-1000)).toBe('-1,000');
  });

  it('should handle edge cases', () => {
    expect(formatTokenAmount(0.0000001)).toBe('0');
    expect(formatTokenAmount(999999999.9999)).toBe('999,999,999.9999');
  });
});
