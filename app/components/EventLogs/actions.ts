import _ from 'underscore';
import * as actionTypes from './actionTypes';

export const loadEventLogs = () => ({ type: actionTypes.LOAD_EVENT_LOGS });

export const loadEventLogsSuccess = (events: Record<string, any>) => ({
  type: actionTypes.LOAD_EVENT_LOGS_SUCCESS,
  payload: events
});

export const loadEventLogsFailure = (error: Record<string, any>) => ({
  type: actionTypes.LOAD_EVENT_LOGS_FAILURE,
  payload: !_.isEmpty(error) ? { ...error } : null
});

export const showActiveValidatorsPopup = (activeValidators: Record<string, any>[] | []) => ({
  type: actionTypes.SHOW_ACTIVE_VALIDATORS_POP_UP,
  payload: activeValidators,
});
