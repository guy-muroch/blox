import { CatchClass } from '../../decorators';
import BloxApi from '../../common/communication-manager/blox-api';
import { METHOD } from '../../common/communication-manager/constants';

@CatchClass<UserService>()
export default class UserService {
  private readonly bloxApi: BloxApi;

  constructor() {
    this.bloxApi = new BloxApi();
    this.bloxApi.init();
  }

  async get() {
    return await this.bloxApi.request(METHOD.GET, 'users/profile');
  }

  async update(payload: Record<string, any>) {
    return await this.bloxApi.request(METHOD.PATCH, 'users', payload);
  }
}
