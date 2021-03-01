import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { version } from '~app/package.json';
import analytics from '~app/backend/analytics';
import LoggedIn from '~app/components/LoggedIn';
import { Loader } from '~app/common/components';
import userSaga from '~app/components/User/saga';
import { getOsVersion } from '~app/utils/service';
import { useInjectSaga } from '~app/utils/injectSaga';
import NotLoggedIn from '~app/components/NotLoggedIn';
import { Log } from '~app/backend/common/logger/logger';
import loginSaga from '~app/components/CallbackPage/saga';
import GlobalStyle from '~app/common/styles/global-styles';
import { deepLink, initApp } from '~app/components/App/service';
import * as loginActions from '~app/components/CallbackPage/actions';
import BaseStore from '~app/backend/common/store-manager/base-store';
import { getIsLoggedIn, getIsLoading } from '~app/components/CallbackPage/selectors';

const AppWrapper = styled.div`
  margin: 0 auto;
  height: 100%;
`;

const loginKey = 'login';
const userKey = 'user';

const App = (props: Props) => {
  const [didInitApp, setAppInitialised] = useState(false);
  useInjectSaga({key: userKey, saga: userSaga, mode: ''});
  useInjectSaga({key: loginKey, saga: loginSaga, mode: ''});
  const {isLoggedIn, isLoading, actions} = props;
  const {setSession, loginFailure} = actions;
  const logger = new Log();

  const init = async () => {
    const baseStore: BaseStore = new BaseStore();
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

  useEffect(() => {
    if (!didInitApp) {
      init();
      deepLink((obj) => {
          if ('token_id' in obj) {
            setSession(obj.token_id);
          }
        },
        loginFailure);
    }
  }, [didInitApp, isLoggedIn, isLoading]);

  if (!didInitApp || isLoading) {
    return <Loader withHeader />;
  }

  return (
    <AppWrapper>
      {isLoggedIn ? <LoggedIn /> : <NotLoggedIn />}
      <GlobalStyle />
    </AppWrapper>
  );
};

type Props = {
  isLoggedIn: boolean;
  isLoading: boolean;
  isTokensExist: () => void;
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
