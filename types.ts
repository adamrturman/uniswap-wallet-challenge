export type ScreenName = 'Landing' | 'EnterWatchAddress' | 'EnterRecoveryPhrase' | 'Portfolio';

export type NavigationType = {
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
};
