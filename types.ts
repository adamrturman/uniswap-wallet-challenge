export type ScreenName = 'Landing' | 'EnterWatchAddress' | 'EnterRecoveryPhrase' | 'EnterRecipientAddress' | 'SelectToken' | 'Portfolio';

export type NavigationType = {
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
};
