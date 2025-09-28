// Jest setup file - only for tests, not for app runtime
// This file is only loaded during Jest test runs, not during app startup

// Clear any global mocks that might interfere
jest.clearAllMocks();

// Ensure we're in test environment
if (process.env.NODE_ENV !== 'test') {
  console.warn('Jest setup file loaded outside of test environment');
}
