export type ScreenName = 'Landing' | 'EnterWatchAddress' | 'EnterRecoveryPhrase' | 'EnterRecipientAddress' | 'SelectToken' | 'EnterAmountToSend' | 'Portfolio';

export type NavigationType = {
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
};
