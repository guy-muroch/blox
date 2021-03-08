import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Login from '~app/components/Login';
import useRouting from '~app/common/hooks/useRouting';
import CallbackPage from '~app/components/Login/components/CallbackPage';

const NotLoggedIn = () => {
  const { ROUTES } = useRouting();

  return (
    <Switch>
      <Route exact path={ROUTES.LOGIN} component={Login} />
      <Route path={ROUTES.LOGIN_CALLBACK} component={CallbackPage} />
    </Switch>
  );
};

export default withRouter(NotLoggedIn);
