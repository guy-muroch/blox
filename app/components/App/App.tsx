import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { version } from '~app/package.json';
import analytics from '~app/backend/analytics';
import LoggedIn from '~app/components/LoggedIn';
import { Loader } from '~app/common/components';
import userSaga from '~app/components/User/saga';
import { getOsVersion } from '~app/utils/service';
import { useInjectSaga } from '~app/utils/injectSaga';
import NotLoggedIn from '~app/components/NotLoggedIn';
import useRouting from '~app/common/hooks/useRouting';
import { Log } from '~app/backend/common/logger/logger';
import NotFoundPage from '~app/components/NotFoundPage';
import GlobalStyle from '~app/common/styles/global-styles';
import { deepLink, initApp } from '~app/components/App/service';
import Http from '~app/backend/common/communication-manager/http';
import BaseStore from '~app/backend/common/store-manager/base-store';
import loginSaga from '~app/components/Login/components/CallbackPage/saga';
import * as loginActions from '~app/components/Login/components/CallbackPage/actions';
import { getIsLoggedIn, getIsLoading } from '~app/components/Login/components/CallbackPage/selectors';

const loginKey = 'login';
const userKey = 'user';
const baseStore: BaseStore = new BaseStore();
const logger: Log = new Log();
const http: Http = new Http();
const logoutNotification = {
  key: ''
};

type AppRouterProps = {
  isLoggedIn: boolean;
};

const AppRouter = ({ isLoggedIn }: AppRouterProps) => {
  const { ROUTES } = useRouting();

  return (
    <Switch>
      <Route exact path={ROUTES.ROOT} render={() => {
        const redirectUrl = isLoggedIn ? ROUTES.LOGGED_IN : ROUTES.LOGIN;
        if (isLoggedIn && logoutNotification.key) {
          notification.close(logoutNotification.key);
          logoutNotification.key = '';
        }
        return <Redirect to={redirectUrl} />;
      }} />
      <Route path={ROUTES.LOGGED_IN} component={LoggedIn} />
      <Route path={ROUTES.LOGIN} component={NotLoggedIn} />
      <Route path={ROUTES.NOT_FOUND} component={NotFoundPage} />
    </Switch>
  );
};

const AppWrapper = styled.div`
  margin: 0 auto;
  height: 100%;
`;

const App = (props: AppProps) => {
  const [didInitApp, setAppInitialised] = useState(false);
  useInjectSaga({key: userKey, saga: userSaga, mode: ''});
  useInjectSaga({key: loginKey, saga: loginSaga, mode: ''});
  const { isLoggedIn, isLoading, actions } = props;
  const { setSession, loginFailure } = actions;

  const unauthorizedListener = () => {
    actions.logout();
    if (!logoutNotification.key) {
      logoutNotification.key = 'logged-out';
      notification.error({
        message: 'You are logged out',
        description: 'Please login again',
        duration: 0,
        key: logoutNotification.key
      });
    }
  };

  const init = async () => {
    let firstTime = false;
    if (!baseStore.get('appUuid')) {
      firstTime = true;
      baseStore.set('appUuid', uuidv4());
    }
    const appUuid = baseStore.get('appUuid');

    // trigger analytics first event
    /* Identify users */
    await analytics.identify(appUuid, {
      os: getOsVersion(),
      appVersion: `v${version}`
    });

    /* Track events */
    if (firstTime) {
      await analytics.track('first-time', {
        appUuid,
      });
    }

    logger.info('app opened', {
      os: getOsVersion(),
      appVersion: `v${version}`
    });

    await setAppInitialised(true);
    await initApp();
  };

  const unauthorizedSubscribe = () => {
    http.events.removeListener(Http.EVENTS.UNAUTHORIZED, unauthorizedListener);
    http.events.once(Http.EVENTS.UNAUTHORIZED, unauthorizedListener);
  };

  useEffect(() => {
    if (!didInitApp) {
      init().then(() => {
        deepLink(
          (obj) => {
            if ('token_id' in obj) {
              setSession(obj.token_id);
              unauthorizedSubscribe();
            }
          },
          loginFailure
        );
      });
    }
  }, [didInitApp, isLoggedIn, isLoading]);

  if (!didInitApp || isLoading) {
    return <Loader withHeader={false} />;
  }

  return (
    <AppWrapper>
      <AppRouter isLoggedIn={isLoggedIn} />
      <GlobalStyle />
    </AppWrapper>
  );
};

type AppProps = {
  isLoggedIn: boolean;
  isLoading: boolean;
  actions: Record<string, any>;
};

const mapStateToProps = (state: any) => ({
  isLoggedIn: getIsLoggedIn(state),
  isLoading: getIsLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(loginActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
