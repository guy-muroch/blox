import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Loader } from '~app/common/components';
import { useInjectSaga } from '~app/utils/injectSaga';
import saga from '~app/components/Login/components/CallbackPage/saga';
import * as loginActions from '~app/components/Login/components/CallbackPage/actions';
import { getIsLoggedIn } from '~app/components/Login/components/CallbackPage/selectors';

const key = 'login';

const CallbackPage = (props: Props) => {
  const { isLoggedIn } = props;
  useInjectSaga({ key, saga, mode: '' });
  useEffect(() => {
    const startLogin = async () => {
      const { location, actions } = props;
      const queryStrings = /access_token|id_token|error/;
      if (queryStrings.test(location.hash)) {
        await actions.login();
      } else {
        throw new Error('Invalid callback URL');
      }
    };
    !isLoggedIn && startLogin();
  }, [isLoggedIn]);
  return <Loader />;
};

const mapStateToProps = (state: State) => ({
  isLoggedIn: getIsLoggedIn(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(loginActions, dispatch),
});

type Props = {
  history: Record<string, any>;
  location: Record<string, any>;
  actions: Record<string, any>;
  isLoggedIn: boolean;
};

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(CallbackPage);
