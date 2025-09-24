export type ScreenName = 'Landing' | 'EnterWatchAddress' | 'EnterRecoveryPhrase' | 'EnterRecipientAddress' | 'Portfolio';

export type NavigationType = {
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
};
