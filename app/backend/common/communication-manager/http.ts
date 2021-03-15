import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Catch } from '~app/backend/decorators';
import config from '~app/backend/common/config';
import { Log } from '~app/backend/common/logger/logger';
import Connection from '~app/backend/common/store-manager/connection';

export default class Http {
  protected notAuthRequest: boolean = false;
  protected storePrefix: string = '';
  baseUrl?: string;
  protected instance: any;
  protected logger: Log;

  constructor() {
    this.logger = new Log('http');
    this.instance = axios.create();

    this.initRetryHandler();
  }

  /**
   * Retry in all cases except unauthorized status
   */
  private initRetryHandler() {
    axiosRetry(this.instance, {
      retries: +config.env.HTTP_RETRIES,
      retryDelay: (retryCount) => {
        return retryCount * +config.env.HTTP_RETRY_DELAY;
      }
    });
  }

  /**
   * Before every single request which is with authorization - setup auth header
   */
  protected setupAuthHeader() {
    if (!this.notAuthRequest) {
      const authToken = Connection.db(this.storePrefix).get('authToken');
      if (authToken) {
        this.instance.defaults.headers.common.Authorization = `Bearer ${authToken}`;
      }
    }
  }

  @Catch()
  async request(method: string, url: string, data: any = null, headers: any = null, fullResponse: boolean = false): Promise<any> {
    try {
      this.setupAuthHeader();
      const response = await this.instance({
        url,
        method,
        data,
        headers: {
          ...this.instance.defaults.headers.common,
          ...headers
        }
      });
      return fullResponse ? response : response.data;
    } catch (error) {
      error.config = {
        url: error.config.url,
        method: error.config.method,
        baseURL: error.config.baseURL
      };
      delete error.response.config;
      this.logger.error(error);
      throw error;
    }
  }
}
