import { Log } from '../common/logger/logger';
import BloxApi from '../common/communication-manager/blox-api';
import { METHOD } from '../common/communication-manager/constants';

export default function bloxAnalyticsPlugin(pluginConfig = {}) {
  // return object for analytics to use
  const bloxApi = new BloxApi('', true);
  const logger = new Log('analytics');

  return {
    /* All plugins require a name */
    name: 'blox-analytics-plugin',
    /* Everything else below this is optional depending on your plugin requirements */
    config: {
      ...pluginConfig
    },
    initialize: async ({ config }) => {
      logger.trace('init', config);
      bloxApi.init();
      // load provider script to page
    },
    page: async ({ payload }) => {
      // call provider specific page tracking
      try {
        logger.trace('page', payload);
        await bloxApi.request(METHOD.PUT, 'analytics/page', payload);
      } catch (e) {
        logger.error('analytics request failed', e);
      }
    },
    track: async ({ payload }) => {
      try {
        logger.trace('track', payload);
        await bloxApi.request(METHOD.PUT, 'analytics/track', payload);
      } catch (e) {
        logger.error('analytics request failed', e);
      }
      // call provider specific event tracking
    },
    identify: async ({ payload }) => {
      try {
        logger.trace('identify', payload);
        await bloxApi.request(METHOD.PUT, 'analytics/identify', payload);
      } catch (e) {
        logger.error('analytics request failed', e);
      }
      // call provider specific user identify method
    },
    loaded: () => {
      // return boolean so analytics knows when it can send data to third party
      return true;
    }
  };
}
