import EventEmitter from 'events';
import axiosRetry from 'axios-retry';
import axios, { AxiosError } from 'axios';
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
  private static eventEmitter: EventEmitter;
  public static EVENTS = {
    UNAUTHORIZED: 'http/error/unauthorized',
    AUTHORIZED: 'http/authorized'
  };
  public static STATUS = {
    UNAUTHORIZED: 401
  };

  constructor() {
    this.logger = new Log('http');
    this.instance = axios.create();

    Http.initEventEmitter();
    this.initRetryHandler();
    this.initUnauthorizedHandler();
  }

  /**
   * Emit event when unauthorized request happened
   */
  private initUnauthorizedHandler() {
    this.instance.interceptors.response.use(response => {
      if (response.status >= 200 && response.status <= 206) {
        Http.eventEmitter.emit(Http.EVENTS.AUTHORIZED);
      }
      return response;
    }, error => {
      if (error.response.status === Http.STATUS.UNAUTHORIZED) {
        Http.eventEmitter.emit(Http.EVENTS.UNAUTHORIZED, error);
      }
      return error;
    });
  }

  /**
   * Retry in all cases except unauthorized status
   */
  private initRetryHandler() {
    axiosRetry(this.instance, {
      retries: +config.env.HTTP_RETRIES,
      retryDelay: (retryCount) => {
        return retryCount * +config.env.HTTP_RETRY_DELAY;
      },
      retryCondition: (error: AxiosError): boolean => {
        return error.response?.status !== Http.STATUS.UNAUTHORIZED;
      },
    });
  }

  /**
   * Used to emit unauthorized requests events
   */
  private static initEventEmitter() {
    if (!Http.eventEmitter) {
      Http.eventEmitter = new EventEmitter();
    }
  }

  get events(): EventEmitter {
    return Http.eventEmitter;
  }

  /**
   * Before every single request which is with authorization - setup auth header
   */
  protected setupAuthHeader() {
    const authToken = Connection.db(this.storePrefix).get('authToken');
    if (!this.notAuthRequest && authToken) {
      this.instance.defaults.headers.common.Authorization = `Bearer ${authToken}`;
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
