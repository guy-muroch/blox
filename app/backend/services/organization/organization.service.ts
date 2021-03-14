import config from '~app/backend/common/config';
import { CatchClass } from '~app/backend/decorators';
import { Log } from '~app/backend/common/logger/logger';
import Http from '~app/backend/common/communication-manager/http';
import BloxApi from '~app/backend/common/communication-manager/blox-api';
import { METHOD } from '~app/backend/common/communication-manager/constants';

const http: Http = new Http();
const logger: Log = new Log('OrganizationService');

@CatchClass<OrganizationService>()
export default class OrganizationService {
  private readonly bloxApi: BloxApi;
  private static profileRequestInterval: NodeJS.Timeout;
  private static isAuthorizedCurrently: boolean;

  constructor() {
    this.bloxApi = new BloxApi();
    this.bloxApi.init();
    this.setProfileRequestInterval();
  }

  /**
   * When Bearer token expired and this request happens without
   * user action - app will show login screen with logout message.
   */
  private setProfileRequestInterval() {
    if (OrganizationService.profileRequestInterval) {
      return;
    }

    // Set interval
    OrganizationService.profileRequestInterval = setInterval(async () => {
      // If not authorized don't do any more requests
      if (!OrganizationService.isAuthorizedCurrently) {
        logger.debug('Currently not authorized! Skipping session check request.');
        return;
      }
      logger.debug('Session check request..');
      await this.get();
    }, config.env.UNAUTHORIZED_CHECK_INTERVAL);

    // React on status codes
    http.events.on(Http.EVENTS.UNAUTHORIZED, () => {
      OrganizationService.isAuthorizedCurrently = false;
    });
    http.events.on(Http.EVENTS.AUTHORIZED, () => {
      OrganizationService.isAuthorizedCurrently = true;
    });
  }

  async get() {
    return await this.bloxApi.request(METHOD.GET, 'organizations/profile');
  }

  async update(payload: any) {
    return await this.bloxApi.request(METHOD.PATCH, 'organizations/profile', payload);
  }

  async getEventLogs() {
    return await this.bloxApi.request(METHOD.GET, 'organizations/event-logs');
  }

  async reportCrash(payload: any) {
    return await this.bloxApi.request(METHOD.POST, 'organizations/crash-report', payload); // , { 'Content-Type': 'multipart/form-data' }
  }
}
