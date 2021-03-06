import React from 'react';
import DepositStepData from './DepositStepData';
import styled from 'styled-components';
import DepositText from './DepositText';

const TextInfo = styled.span`
    font-size: 12px;
    font-weight: 900;
    color: ${({theme, color}) => theme[color] || theme.gray600};
`;

const FEE_TOOLTIP = 'Blox Staking service charges will only be applied to validators created after this promotion ends. Don\'t worry, we will NEVER charge you for creating or running the validators created during this promotion period.';
const DEPOSIT_TOOLTIP = 'Blox has no access to your 32 ETH as the funds are deposited directly onto the official Eth2 deposit contract. ETH withdrawals are currently not supported but are scheduled to be enabled in later phases as Eth2 matures.';

const MainNetText = (props: Props) => {
  const {publicKey, onCopy} = props;
  return (
    <div>
      <DepositStepData step={1} title={'Yearly fee - Free for a limited time'} tooltip={FEE_TOOLTIP} tag={'Yes, It\'s Free'} hint amount={0} token={'ETH'}>
        <TextInfo>
          <TextInfo>We will NOT charge you on validators created during the &quot;early stage&quot; period. Once we start to charge, you will be notified.</TextInfo>
        </TextInfo>
      </DepositStepData>
      <DepositStepData step={2} title={'Validator deposit'} amount={32} token={'ETH'} tooltip={DEPOSIT_TOOLTIP}>
        <DepositText publicKey={publicKey} token={'ETH'} onCopy={onCopy} />
      </DepositStepData>
    </div>
  );
};

type Props = {
  publicKey: string;
  onCopy: () => void;
};

export default MainNetText;
