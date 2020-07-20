export const getIsLoading = (state) => state.wizard.isLoading;

export const getOneTimePassword = (state) =>
  state.wizard.otpAndCommand && state.wizard.otpAndCommand.otp;

export const getCommand = (state) =>
  state.wizard.otpAndCommand && state.wizard.otpAndCommand.command;

export const getWallet = (state) => state.wizard.wallet;

export const getWalletStatus = (state) =>
  state.wizard.wallet && state.wizard.wallet.status;

export const getWalletError = (state) =>
  state.wizard.wallet && state.wizard.wallet.error;

export const getNetwork = (state) => state.wizard.network;

export const getAccountId = (state) =>
  state.wizard && state.wizard.account && state.wizard.account.id;

export const getAccountStatus = (state) =>
  state.wizard.account && state.wizard.account.status;

export const getPublicKey = (state) =>
  state.wizard.account && state.wizard.account.publicKey;

export const getDepositData = (state) =>
  state.wizard && state.wizard.depositData;

export const getWizardFinishedStatus = (state) => state.wizard.isFinished;