import produce from 'immer';
import * as actionTypes from './actionTypes';
import { State } from './types';

export const initialState: State = {
  isLoading: false,
  isLoggedIn: false,
  idToken: '',
  error: null,
  userData: {},
};

/* eslint-disable default-case, no-param-reassign */
const loginReducer = (state = initialState, action: Action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.LOGIN_INIT:
      case actionTypes.CHECK_IF_TOKEN_EXIST:
        draft.isLoading = true;
        break;
      case actionTypes.LOGIN_SET_ID_TOKEN:
        draft.idToken = action.payload;
        break;
      case actionTypes.LOGIN_SUCCESS:
        draft.userData = { ...action.payload };
        draft.isLoading = false;
        draft.isLoggedIn = true;
        break;
      case actionTypes.CHECK_IF_TOKEN_EXIST_SUCCESS:
        draft.isLoading = false;
        draft.isLoggedIn = true;
        break;
      case actionTypes.LOGIN_FAILURE:
      case actionTypes.CHECK_IF_TOKEN_EXIST_FAILURE:
        draft.isLoading = false;
        draft.error = action.payload;
        break;
    }
  });

type Action = {
  type: string;
  payload: any;
};

export default loginReducer;