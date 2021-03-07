import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import config from '~app/backend/common/config';
import { getNetwork } from '~app/components/Wizard/selectors';
import { loadDepositData } from '~app/components/Wizard/actions';
import * as wizardSelectors from '~app/components/Wizard/selectors';
import { setDepositNeeded } from '~app/components/Accounts/actions';
import useProcessRunner from '~app/components/ProcessRunner/useProcessRunner';
import usePasswordHandler from '~app/components/PasswordHandler/usePasswordHandler';
import { GenerateKeys, KeysGenerated } from '~app/components/Wizard/components/Validators/CreateValidator/components';

const CreateValidator = (props: Props) => {
  const { isLoading, isDone, processData, error, startProcess, clearProcessState } = useProcessRunner();
  const { checkIfPasswordIsNeeded } = usePasswordHandler();
  const { setPage, callLoadDepositData, callSetDepositNeeded, selectedNetwork, depositData } = props;
  const account = processData && processData.length ? processData[0] : processData;

  useEffect(() => {
    if (isDone && account && !error) {
      const accountIndex = +account.name.replace('account-', '');
      callLoadDepositData(account.publicKey, accountIndex, account.network);
    }
  }, [isLoading, account, error]);

  const onGenerateKeysClick = () => {
    const onSuccess = () => {
      if (error) {
        clearProcessState();
      }
      if (!isLoading) {
        startProcess('createAccount', 'Generating Validator Keys...');
      }
    };
    checkIfPasswordIsNeeded(onSuccess);
  };

  const onContinueClick = () => {
    const { publicKey, network } = account;
    const accountIndex = +account.name.replace('account-', '');
    callSetDepositNeeded({
      isNeeded: true,
      publicKey,
      accountIndex,
      network
    });
    setPage(config.PAGES.VALIDATOR.STAKING_DEPOSIT);
  };

  return (
    <>
      {account && !error && depositData ? (
        <KeysGenerated depositData={depositData} onClick={onContinueClick} validatorData={account} />
      ) : (
        <GenerateKeys network={selectedNetwork} onClick={onGenerateKeysClick} isLoading={isLoading} error={error} />
      )}
    </>
  );
};

const mapStateToProps = (state: State) => ({
  selectedNetwork: getNetwork(state),
  depositData: wizardSelectors.getDepositData(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  callLoadDepositData: (publicKey, accountIndex, network) => dispatch(loadDepositData(publicKey, accountIndex, network)),
  callSetDepositNeeded: (payload: DepositNeededPayload) => dispatch(setDepositNeeded(payload)),
});

type Props = {
  page: number;
  network: string;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
  processData?: Record<string, any> | null;
  callLoadDepositData: (publicKey: string, accountIndex: number, network: string) => void;
  callSetDepositNeeded: (payload: DepositNeededPayload) => void;
  selectedNetwork: string;
  depositData: any;
};

type DepositNeededPayload = {
  isNeeded: boolean;
  publicKey: string;
  accountIndex: number;
  network: string;
};

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(CreateValidator);
