import { remote } from 'electron';
import { notification } from 'antd';
import queryString from 'query-string';
import { Log } from '~app/backend/common/logger/logger';

const logger = new Log('deepLink');
const isWindows = process.platform === 'win32';

export const initApp = () => {
  const placement = 'bottomRight';
  notification.config({ placement });
};

export const deepLink = (onSuccess, onFailure) => {
  remote.app.on('open-url', (_event, data) => {
    if (data) {
      let params: Record<string, any>;
      if (isWindows) {
        const questionMarkIndex = data.indexOf('//');
        const trimmedCode = data.substring(questionMarkIndex + 2);
        params = queryString.parse(trimmedCode);
      } else {
        const [, query] = data.split('//');
        params = queryString.parse(query);
      }
      try {
        if (Object.keys(params).length > 0) {
          onSuccess(params);
        } else {
          onFailure('Unknown DeepLink!');
        }
      }
      catch (e) {
        onFailure(e);
      }
    }
  });

  remote.app.on('second-instance', (_event, commandLine) => {
    logger.trace(commandLine);
    const cmd = commandLine[2] || commandLine[1];
    if (cmd && cmd.includes('blox-live://')) {
      let params: Record<string, any>;
      if (isWindows) {
        const questionMarkIndex = cmd.indexOf('//');
        const trimmedCode = cmd.substring(questionMarkIndex + 2);
        const withoutSlash = trimmedCode.slice(0, trimmedCode.length - 1);
        params = queryString.parse(withoutSlash);
      } else {
        const [, query] = cmd.split('//');
        params = queryString.parse(query);
      }
      try {
        if (params) {
          const win = remote.getCurrentWindow();
          onSuccess(params);
          win.focus();
        } else {
          onFailure('Unknown DeepLink!');
        }
      }
      catch (e) {
        onFailure(e);
      }
    } else {
      logger.error('Token is not found', commandLine);
    }
  });
};

export const cleanDeepLink = () => {
  remote.app.removeAllListeners('open-url');
  remote.app.removeAllListeners('second-instance');
};
