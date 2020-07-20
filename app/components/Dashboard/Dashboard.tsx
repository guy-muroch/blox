import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';

import { Loader } from '../../common/components';
import HomePage from '../HomePage';
import SettingsPage from '../SettingsPage';
import Header from '../common/Header';

import { loadWallet } from '../Wizard/actions';
import {
  getWalletStatus,
  getIsLoading,
  getWalletError,
} from '../Wizard/selectors';
import wizardSaga from '../Wizard/saga';

import { loadAccounts } from '../Accounts/actions';
import {
  getAccounts,
  getAccountsLoadingStatus,
  getAccountsError,
} from '../Accounts/selectors';
import accountsSaga from '../Accounts/saga';

import { useInjectSaga } from '../../utils/injectSaga';

const wizardKey = 'wizard';
const accountsKey = 'accounts';

const Content = styled.div`
  width: 100%;
  padding-top: 70px;
  display: flex;
`;

const Dashboard = (props: Props) => {
  // TODO: remove all unnecessary logic
  const {
    callLoadWallet,
    walletStatus,
    isLoadingWallet,
    walletErorr,
    callLoadAllAccounts,
    accounts,
    isLoadingAccounts,
    accountsErorr,
  } = props;
  useInjectSaga({ key: wizardKey, saga: wizardSaga, mode: '' });
  useInjectSaga({ key: accountsKey, saga: accountsSaga, mode: '' });

  useEffect(() => {
    const didntLoadWallet = !walletStatus && !isLoadingWallet && !walletErorr;
    const didntLoadAccounts = !accounts && !isLoadingAccounts && !accountsErorr;

    if (didntLoadWallet) {
      callLoadWallet();
    }
    if (didntLoadAccounts) {
      callLoadAllAccounts();
    }
  }, [isLoadingWallet, isLoadingAccounts]);

  const otherProps = {
    walletStatus,
    isLoadingWallet,
    accounts,
    isLoadingAccounts,
  };

  if (isLoadingWallet || isLoadingAccounts) {
    return <Loader />;
  }

  return (
    <>
      <Header withMenu />
      <Content>
        <Switch>
          <Route
            exact
            path="/"
            render={(renderProps) => (
              <HomePage
                walletStatus={walletStatus}
                accounts={accounts}
                {...renderProps}
                {...otherProps}
              />
            )}
          />
          <Route
            path="/settings"
            render={(renderProps) => (
              <SettingsPage withMenu {...renderProps} {...otherProps} />
            )}
          />
        </Switch>
      </Content>
    </>
  );
};

type Props = {
  walletStatus: string;
  isLoadingWallet: boolean;
  walletErorr: string;
  callLoadWallet: () => void;

  accounts: [];
  isLoadingAccounts: boolean;
  accountsErorr: string;
  callLoadAllAccounts: () => void;
};

const mapStateToProps = (state: State) => ({
  walletStatus: getWalletStatus(state),
  isLoadingWallet: getIsLoading(state),
  walletErorr: getWalletError(state),

  accounts: getAccounts(state),
  isLoadingAccounts: getAccountsLoadingStatus(state),
  accountsErorr: getAccountsError(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  callLoadWallet: () => dispatch(loadWallet()),
  callLoadAllAccounts: () => dispatch(loadAccounts()),
});

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);