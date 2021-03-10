import EventEmitter from 'events';
import axiosRetry from 'axios-retry';
import axios, { AxiosError } from 'axios';
import { Catch } from '~app/backend/decorators';
import config from '~app/backend/common/config';
import { Log } from '~app/backend/common/logger/logger';
import BaseStore from '~app/backend/common/store-manager/base-store';
import Connection from '~app/backend/common/store-manager/connection';

export default class Http {
  baseUrl?: string;
  protected instance: any;
  protected logger: Log;
  private static eventEmitter: EventEmitter;
  private baseStore: BaseStore;
  private static testHeaders: any;
  private static featureSessionExpiredListenersExists: boolean;
  public static EVENTS = {
    UNAUTHORIZED: 'http/error/unauthorized'
  };
  private static STATUS = {
    UNAUTHORIZED: 401
  };

  constructor() {
    this.logger = new Log('http');
    this.instance = axios.create();
    this.baseStore = new BaseStore();

    Http.initEventEmitter();
    this.initRetryHandler();
    this.initUnauthorizedHandler();
    this.testLoginExpired();
  }

  /**
   * Trigger token to be expired:
   *    window.dispatchEvent(new CustomEvent('expire-session'))
   *
   * Trigger token to not be expired:
   *    window.dispatchEvent(new CustomEvent('un-expire-session'))
   */
  private testLoginExpired() {
    if (!this.baseStore.get('feature:session-expired:test')) {
      return;
    }
    if (Http.featureSessionExpiredListenersExists) {
      return;
    }
    window.addEventListener('expire-session', () => {
      Http.testHeaders = {
        'Authorization': `Bearer ${Connection.db().get('authToken')}-CORRUPTED!`
      };
      console.warn('❌ ❌ ❌ BEARER TOKEN IS EXPIRED NOW');
    });
    window.addEventListener('un-expire-session', () => {
      Http.testHeaders = {};
      console.warn('✅ ✅ ✅ BEARER TOKEN NOW CLEANED UP');
    });
    Http.featureSessionExpiredListenersExists = true;
  }

  /**
   * Emit event when unauthorized request happened
   */
  private initUnauthorizedHandler() {
    this.instance.interceptors.response.use(response => {
      return response;
    }, error => {
      if (error.response.status === Http.STATUS.UNAUTHORIZED) {
        return Http.eventEmitter.emit(Http.EVENTS.UNAUTHORIZED, error);
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

  @Catch()
  async request(method: string, url: string, data: any = null, headers: any = null, fullResponse: boolean = false): Promise<any> {
    try {
      const response = await this.instance({
        url,
        method,
        data,
        headers: {
          ...this.instance.defaults.headers.common,
          ...headers,
          ...Http.testHeaders
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
