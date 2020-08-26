import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { notification } from 'antd';
import { InfoWithTooltip } from 'common/components';
import { INTRO_TOOLTIP_TEXT } from './constants';
import { Title, Paragraph, Link, BigButton } from '../../common';
import * as wizardActions from '../../../actions';
import * as selectors from '../../../selectors';

import { clearAccountsData } from '../../../../Accounts/actions';
import { getAccounts } from '../../../../Accounts/selectors';

import { getData } from '../../../../ProcessRunner/selectors';

import { DepositData } from './components';

const Wrapper = styled.div`
  width:580px;
`;

const GoEthButton = styled.a`
  width:113px;
  height:28px;
  border-radius:6px;
  border:solid 1px ${({theme}) => theme.gray400};
  font-size: 11px;
  font-weight: 500;
  color:${({theme}) => theme.primary900};
  display:flex;
  align-items:center;
  justify-content:center;
  margin-top:12px;
  cursor:pointer;
`;

const ButtonsWrapper = styled.div`
  width:100%;
  margin-top:36px;
  display:flex;
  justify-content:space-between;
`;

const CancelButton = styled(BigButton)`
  color:${({theme}) => theme.gray600};
  background-color:transparent;
  border:1px solid ${({theme}) => theme.gray400};
`;

const StakingDeposit = (props: Props) => {
  const { setPage, page, isLoading, depositData, accountDataFromProcess, accountsFromApi, actions, callClearAccountsData } = props;
  const { updateAccountStatus, clearWizardData, loadDepositData } = actions;

  useEffect(() => {
    const needToLoadDepositData = !depositData && !isLoading && accountsFromApi && accountsFromApi.length > 0;
    if (needToLoadDepositData) {
      const { publicKey } = accountsFromApi[0];
      loadDepositData(publicKey);
    }
  }, [depositData, isLoading, accountsFromApi]);

  const clearWizardAndAccountsData = async () => {
    await clearWizardData();
    await callClearAccountsData();
  };

  const onMadeDepositButtonClick = async () => {
    const accountId = accountDataFromProcess ?
      accountDataFromProcess.id : accountsFromApi[0].id;
    await updateAccountStatus(accountId);
    await clearWizardAndAccountsData();
    await setPage(page + 1);
  };

  const onDepositLaterButtonClick = async () => {
    await clearWizardAndAccountsData();
    await setPage(page + 2);
  };

  const onCopy = () => notification.success({message: 'Copied to clipboard!'});

  return (
    <Wrapper>
      <Title>TestNet Staking Deposit</Title>
      <Paragraph>
        To start staking on our Testnet, you are required to stake 32 GoEth
        <InfoWithTooltip title={INTRO_TOOLTIP_TEXT} placement="bottom" /> into the
        <br />
        validator deposit contract. The Blox test network uses the Goerli
        network to <br />
        simulate validator deposits on the proof-of-work enabled Beacon-chain.
        <GoEthButton href={'https://discord.gg/Kw5eFh'} target={'_blank'}>Need GoETH?</GoEthButton>
      </Paragraph>

      {depositData && <DepositData depositData={depositData} onCopy={onCopy} />}
      <Link href={'https://www.bloxstaking.com/blox-guide-how-do-i-submit-my-staking-deposit'}>
        Need help?
      </Link>
      <ButtonsWrapper>
        <BigButton onClick={onMadeDepositButtonClick}>I&apos;ve Made the Deposit</BigButton>
        <CancelButton onClick={onDepositLaterButtonClick}>I&apos;ll Deposit Later</CancelButton>
      </ButtonsWrapper>
    </Wrapper>
  );
};

const mapStateToProps = (state: State) => ({
  isLoading: selectors.getIsLoading(state),
  depositData: selectors.getDepositData(state),
  accountDataFromProcess: getData(state),
  accountsFromApi: getAccounts(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(wizardActions, dispatch),
  callClearAccountsData: () => dispatch(clearAccountsData())
});

type Props = {
  page: number;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
  isLoading: boolean;
  depositData: string;
  accountDataFromProcess: Record<string, any> | null;
  accountsFromApi: { publicKey: string, id: number }[];
  actions: Record<string, any> | null;
  callClearAccountsData: () => void;
};

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(StakingDeposit);
