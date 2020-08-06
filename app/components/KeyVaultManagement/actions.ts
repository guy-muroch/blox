import * as actionTypes from './actionTypes';

export const keyvaultSetCouldProvider = (couldProvider: string) => ({
  type: actionTypes.KEYVAULT_SET_COLUD_PROVIDER,
  payload: couldProvider,
});

export const keyvaultProcessSubscribe = (name: string, defaultMessage: string) => ({
  type: actionTypes.KEYVAULT_PROCESS_SUBSCRIBE,
  payload: { name, defaultMessage },
});

export const keyvaultProcessObserve = (message: string, isActive: boolean) => ({
  type: actionTypes.KEYVAULT_PROCESS_OBSERVE,
  payload: {message, isActive},
});

export const keyvaultProcessUnSubscribe = () => ({
  type: actionTypes.KEYVAULT_PROCESS_UNSUBSCRIBE,
});

export const keyvaultProcessFailure = (error: Record<string, any>) => ({
  type: actionTypes.KEYVAULT_PROCESS_FAILURE,
  payload: error,
});

export const keyvaultProcessClearState = () => ({
  type: actionTypes.KEYVAULT_PROCESS_CLEAR_STATE,
});

export const keyvaultSetCredentials = (accessKeyId: string, secretAccessKey: string) => ({
  type: actionTypes.KEYVAULT_SET_CREDENTIALS,
  payload: {accessKeyId, secretAccessKey},
});
