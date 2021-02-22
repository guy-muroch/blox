import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { Switch, withStyles } from '@material-ui/core';
import * as actionsFromDashboard from '../../../actions';
import BaseStore from '../../../../../backend/common/store-manager/base-store';

const TestNetToggleWrapper = styled.div`
  text-align: right;
  color: ${({theme}) => theme.gray600};
  margin-top: -30px;
`;

const TestNetToggleText = styled.div`
  color: ${({ theme }) => theme.gray600};
  font-size: 12px;
  display: inline-block;
`;

const NetworkSwitch = withStyles((theme) => ({
  root: {
    width: 30,
    height: 16,
    padding: 0,
    display: 'inline-flex',
    margin: 5
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

const testNetConfigKey = 'dashboard:testNet:isHidden';
const baseStore = new BaseStore();

const TestNetToggle = (props: TestNetToggleProps) => {
  // const { loadDashboardData } = useDashboardData();
  const { dashboardActions } = props;
  const { setTestNetFlag } = dashboardActions;
  const isConfigHideTestNet = baseStore.get(testNetConfigKey);
  const [switchActive, setSwitchActive] = useState(Boolean(isConfigHideTestNet));

  const onNetworkSwitchChange = (event) => setSwitchActive(event.target.checked);

  useEffect(() => {
    // Global redux store change
    setTestNetFlag({ testNet: { isHidden: switchActive }});
    // Save in persistent config
    baseStore.set(testNetConfigKey, switchActive);
  }, [switchActive]);

  return (
    <TestNetToggleWrapper>
      <TestNetToggleText>Hide TestNet</TestNetToggleText>
      <NetworkSwitch
        checked={switchActive}
        onChange={onNetworkSwitchChange}
      />
    </TestNetToggleWrapper>
  );
};

type TestNetToggleProps = {
  dashboardActions: any
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dashboardActions: bindActionCreators(actionsFromDashboard, dispatch),
});

type Dispatch = (arg0: { type: string }) => any;

export default connect(null, mapDispatchToProps)(TestNetToggle);
