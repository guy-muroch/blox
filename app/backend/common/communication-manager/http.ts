import EventEmitter from 'events';
import axios, { AxiosError } from 'axios';
import config from '../config';
import axiosRetry from 'axios-retry';
import { Log } from '../logger/logger';
import { Catch } from '../../decorators';
import Connection from '../store-manager/connection';

export default class Http {
  baseUrl?: string;
  protected instance: any;
  protected logger: Log;
  private static eventEmitter: EventEmitter;
  public static EVENTS = {
    UNAUTHORIZED: 'http/error/unauthorized',
    AUTHORIZED: 'http/authorized'
  };
  private static STATUS = {
    UNAUTHORIZED: 401
  };
  private static testHeaders: any;

  constructor() {
    this.logger = new Log('http');
    this.instance = axios.create();

    Http.initEventEmitter();
    this.initRetryHandler();
    this.initUnauthorizedHandler();
    // this.testLoginExpired();
  }

  // @ts-ignore
  private testLoginExpired() {
    setTimeout(() => {
      if (!Http.testHeaders) {
        Http.testHeaders = {
          'Authorization': `Bearer ${Connection.db().get('authToken')}-CORRUPTED!`
        };
        console.warn('❌ ❌ ❌ BEARER TOKEN IS EXPIRED NOW');
        console.warn('❌ ❌ ❌ BEARER TOKEN IS EXPIRED NOW');
        console.warn('❌ ❌ ❌ BEARER TOKEN IS EXPIRED NOW');
      }
    }, 30000);
    setTimeout(() => {
      if (Http.testHeaders?.Authorization) {
        Http.testHeaders = {};
        console.warn('✅ ✅ ✅ BEARER TOKEN NOW CLEANED UP');
        console.warn('✅ ✅ ✅ BEARER TOKEN NOW CLEANED UP');
        console.warn('✅ ✅ ✅ BEARER TOKEN NOW CLEANED UP');
      }
    }, 60000);
  }

  private initUnauthorizedHandler() {
    this.instance.interceptors.response.use(response => {
      if (this.instance.defaults.headers?.common?.Authorization?.indexOf('Bearer') !== -1) {
        Http.eventEmitter.emit(Http.EVENTS.AUTHORIZED);
      }
      return response;
    }, error => {
      if (error.response.status === Http.STATUS.UNAUTHORIZED) {
        return Http.eventEmitter.emit(Http.EVENTS.UNAUTHORIZED, error);
      }
      return error;
    });
  }

  private initRetryHandler() {
    axiosRetry(this.instance, {
      retries: +config.env.HTTP_RETRIES,
      retryDelay: (retryCount) => {
        return retryCount * +config.env.HTTP_RETRY_DELAY;
      },
      retryCondition: (error: AxiosError): boolean => {
        return error.response.status !== Http.STATUS.UNAUTHORIZED;
      },
    });
  }

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
