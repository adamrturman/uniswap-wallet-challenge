// Jest configuration - only active during test runs
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  testTimeout: 10000,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@expo|expo|@unimodules|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  // Ensure mocks are only loaded during tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  // Don't auto-mock modules
  automock: false,
  // Only run when NODE_ENV is test
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  }
};
