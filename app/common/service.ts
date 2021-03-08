import moment from 'moment';
import { app, remote, shell } from 'electron';
import { Log } from '~app/backend/common/logger/logger';
import Connection from '~app/backend/common/store-manager/connection';

const logger = new Log();

export const saveLastConnection = () => {
  const now = moment().utc();
  Connection.db().set('lastConnection', now);
  logger.debug(`App Saved Connection Time: ${now}`);
};

export const loadLastConnection = () => {
  return Connection.db().get('lastConnection');
};

export const onWindowClose = () => {
  window.addEventListener('beforeunload', () => {
    saveLastConnection();
  });
};

export const openLocalDirectory = (directory: string) => {
  const dataPath = (app || remote.app).getPath('userData');
  shell.openExternal(`file:///${dataPath}/${directory}`);
};
