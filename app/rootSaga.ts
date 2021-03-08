import { all } from 'redux-saga/effects';
import user from '~app/components/User/saga';
import wizard from '~app/components/Wizard/saga';
import accounts from '~app/components/Accounts/saga';
import versions from '~app/components/Versions/saga';
import eventLogs from '~app/components/EventLogs/saga';
import websocket from '~app/components/WebSockets/saga';
import password from '~app/components/PasswordHandler/saga';
import organization from '~app/components/Organization/saga';
import processRunner from '~app/components/ProcessRunner/saga';
import login from '~app/components/Login/components/CallbackPage/saga';
import keyvaultManagement from '~app/components/KeyVaultManagement/saga';

export default function* rootSaga() { // TODO: check injectSaga instead
  yield all([
    login(),
    organization(),
    wizard(),
    websocket(),
    accounts(),
    keyvaultManagement(),
    processRunner(),
    versions(),
    eventLogs(),
    password(),
    user(),
  ]);
}
