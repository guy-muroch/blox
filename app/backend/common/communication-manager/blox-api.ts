import config from '~app/backend/common/config';
import Http from '~app/backend/common/communication-manager/http';

export default class BloxApi extends Http {
  constructor(prefix: string = '', notAuthRequest = false) {
    super();
    this.storePrefix = prefix;
    this.baseUrl = config.env.API_URL;
    this.notAuthRequest = notAuthRequest;
  }

  init = () => {
    this.instance.defaults.baseURL = this.baseUrl;
  };
}
