import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withStyles, Select, MenuItem } from '@material-ui/core';
import config from '~app/backend/common/config';
import BaseStore from '~app/backend/common/store-manager/base-store';
import useNetworkSwitcher from '~app/components/Dashboard/components/NetworkSwitcher/useNetworkSwitcher';

const NetworkSwitcherWrapper = styled.div`
  text-align: right;
  color: ${({theme}) => theme.gray600};
  margin-top: -30px;
`;

const NetworkSwitchSelect = withStyles((theme) => ({
  select: {
    fontSize: 12,
    height: 16,
    padding: 0,
    display: 'inline-flex',
    margin: 5,
    border: 0
  }
}))(Select);

const testNetConfigKey = config.FLAGS.TESTNET_HIDDEN;
const baseStore = new BaseStore();

const NetworkSwitcher = () => {
  const isConfigHideTestNet = baseStore.get(testNetConfigKey);
  const [isTestNetHidden, setTestNetHidden] = useState(Boolean(isConfigHideTestNet));
  const { setTestNetHiddenFlag } = useNetworkSwitcher();

  const handleChange = (event) => {
    setTestNetHidden(event.target.value === 1);
  };

  useEffect(() => {
    setTestNetHiddenFlag(isTestNetHidden);
  }, [isTestNetHidden]);

  return (
    <NetworkSwitcherWrapper>
      <NetworkSwitchSelect
        labelId="network-switcher-label"
        id="network-switcher-select"
        value={isTestNetHidden ? 1 : 2}
        onChange={handleChange}
      >
        <MenuItem value={1}>Mainnet Network</MenuItem>
        <MenuItem value={2}>Testnet Network</MenuItem>
      </NetworkSwitchSelect>
    </NetworkSwitcherWrapper>
  );
};

export default connect(null, null)(NetworkSwitcher);
