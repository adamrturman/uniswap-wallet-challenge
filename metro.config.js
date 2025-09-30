const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add polyfills for ethers
config.resolver.alias = {
  ...config.resolver.alias,
  crypto: 'expo-crypto',
  stream: 'readable-stream',
  buffer: '@craftzdog/react-native-buffer',
};

// Fix for Metro export path issues
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add resolver configuration to handle package exports
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Disable unstable_enablePackageExports to fix Metro compatibility issues
config.resolver.unstable_enablePackageExports = false;

// Add web-specific resolver configuration
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'web.js',
  'web.ts',
  'web.tsx',
];

// Configure transformer for better web compatibility
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
};

module.exports = config;
