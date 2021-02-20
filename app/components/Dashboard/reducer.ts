import produce from 'immer';
import * as actionTypes from './actionTypes';

const initialState = {
  type: '',
  show: false,
  text: '',
  onSuccess: null,
  confirmation: {
    title: '',
    confirmButtonText: '',
    cancelButtonText: '',
    onConfirmButtonClick: null,
    onCancelButtonClick: null
  }
};

/* eslint-disable default-case, no-param-reassign */
const modalDisplayReducer = (state = initialState, action: Action) => produce(state, (draft) => {
  switch (action.type) {
    case actionTypes.SET_MODAL_DISPLAY:
      draft.type = action.payload.type;
      draft.show = action.payload.show;
      draft.text = action.payload.text;
      draft.confirmation = action.payload.confirmation;
      draft.onSuccess = draft.confirmation?.onConfirmButtonClick || action.payload.onSuccess;
      break;
    case actionTypes.CLEAR_MODAL_DISPLAY_DATA:
      draft.type = initialState.type;
      draft.show = initialState.show;
      draft.text = initialState.text;
      draft.onSuccess = initialState.onSuccess;
      draft.confirmation = initialState.confirmation;
  }
});

type Action = {
  type: string;
  payload: any;
};

export default modalDisplayReducer;
