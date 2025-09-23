import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Landing from './components/Landing';
import EnterWatchAddress from './components/EnterWatchAddress';

export default function App() {
  const [route, setRoute] = useState<'landing' | 'enterWatch'>('landing');

  return (
    <View style={styles.container}>
      {route === 'landing' ? (
        <Landing
          onImportWallet={() => console.log('Import wallet pressed')}
          onWatchAddress={() => setRoute('enterWatch')}
        />
      ) : (
        <EnterWatchAddress
          onBack={() => setRoute('landing')}
          onContinue={(address) => console.log('Continue with', address)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
