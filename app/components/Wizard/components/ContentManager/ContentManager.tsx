import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Template } from '../common';
import WelcomePage from '../WelcomePage';
import * as WalletPages from '../Wallet';
import * as ValidatorPages from '../Validators';
import config from '../../../../backend/common/config';
import { getDepositToNetwork } from '../../../Accounts/selectors';

import walletImage from 'components/Wizard/assets/img-key-vault.svg';
import testnetValidatorImage from '../../assets/img-validator-test-net.svg';
import mainnetValidatorImage from '../../assets/img-validator-main-net.svg';

const Wrapper = styled.div`
  height: 100%;
  padding-top: 70px;
`;

const switcher = (props: Props) => {
  const { page, network } = props;
  const validatorImage = network === config.env.PYRMONT_NETWORK ? testnetValidatorImage : mainnetValidatorImage;
  const PAGES = config.PAGES;
  let component;
  let bgImage = "";

  switch (page) {
    case PAGES.WALLET.SELECT_CLOUD_PROVIDER:
      bgImage = walletImage;
      component = <WalletPages.CloudProvider {...props} />;
      break;

    case PAGES.WALLET.CREATE_SERVER:
      bgImage = walletImage;
      component = <WalletPages.CreateServer {...props} />;
      break;

    case PAGES.WALLET.CONGRATULATIONS:
      bgImage = walletImage;
      component = <WalletPages.CongratulationPage {...props} />;
      break;

    case PAGES.WALLET.IMPORT_OR_GENERATE_SEED:
      bgImage = validatorImage;
      component = <WalletPages.ImportOrGenerateSeed {...props} />;
      break;

    case PAGES.WALLET.ENTER_MNEMONIC:
      bgImage = validatorImage;
      component = <WalletPages.Passphrase {...props} />;
      break;

    case PAGES.VALIDATOR.SELECT_NETWORK:
      component = <ValidatorPages.SelectNetwork {...props} />;
      break;

    case PAGES.VALIDATOR.CREATE_VALIDATOR:
      bgImage = validatorImage;
      component = <ValidatorPages.CreateValidator {...props} />;
      break;

    case PAGES.VALIDATOR.STAKING_DEPOSIT:
      bgImage = validatorImage;
      component = <ValidatorPages.StakingDeposit {...props} />;
      break;

    case PAGES.VALIDATOR.CONGRATULATIONS:
      bgImage = validatorImage;
      component = <ValidatorPages.CongratulationPage {...props} />;
      break;

    case PAGES.WALLET.IMPORT_MNEMONIC:
      bgImage = validatorImage;
      component = <WalletPages.ImportPassphrase {...props} />;
      break;

    case PAGES.WALLET.IMPORT_VALIDATORS:
      bgImage = validatorImage;
      component = <WalletPages.ImportValidators {...props} />;
      break;
  }

  if (!component || page === PAGES.WELCOME.DEFAULT) {
    return <WelcomePage {...props} />;
  }

  return (
    <Template
      key={page}
      bgImage={bgImage}
      {...props}
      component={component}
    />
  )
};

const ContentManager = (props: Props) => <Wrapper>{switcher(props)}</Wrapper>;

const mapStateToProps = (state: any) => ({
  network: getDepositToNetwork(state),
});

type Props = {
  page: number;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
  network: string;
};

export default connect(mapStateToProps)(ContentManager);
