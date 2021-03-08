import config from '~app/backend/common/config';
import { CatchClass } from '~app/backend/decorators';
import BloxApi from '~app/backend/common/communication-manager/blox-api';
import { METHOD } from '~app/backend/common/communication-manager/constants';

@CatchClass<OrganizationService>()
export default class OrganizationService {
  private readonly bloxApi: BloxApi;
  private static profileRequestInterval: NodeJS.Timeout;

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
    OrganizationService.profileRequestInterval = setInterval(async () => {
      await this.get();
    }, config.env.UNAUTHORIZED_CHECK_INTERVAL);
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
