import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import { blue, grey } from '@material-ui/core/colors';
import { ClickAwayListener } from '@material-ui/core';
import { Icon } from '~app/common/components';
import config from '~app/backend/common/config';
import BaseStore from '~app/backend/common/store-manager/base-store';
import { Menu, MenuWrapper, MenuItem, MenuButton } from '~app/common/components/Menu';
import useNetworkSwitcher from '~app/components/Dashboard/components/NetworkSwitcher/useNetworkSwitcher';

const NetworkSwitcherWrapper = styled.div`
  text-align: right;
  color: ${({theme}) => theme.gray600};
  margin-top: -30px;
  font-size: 12px;
`;

const NetworkSwitcherButton = styled.div<{ isActive }>`
  cursor: pointer;
  display: inline-block;
  margin-top: 7px;
  color: ${({ isActive }) => isActive ? blue[900] : grey['600']}
`;

const useStyles = makeStyles(() => ({
  menu: {
    zIndex: 1,
    width: 150
  },
  menuItem: {
    '& > a': {
      color: grey['600'],
      '&:hover': {
        color: blue['900']
      }
    },
    fontSize: 14,
  },
  menuIcon: {
    display: 'inline',
    marginLeft: 3,
    float: 'right'
  }
}));

const testNetConfigKey = config.FLAGS.DASHBOARD.TESTNET_HIDDEN;
const baseStore: BaseStore = new BaseStore();

const NetworkSwitcher = () => {
  const isConfigHideTestNet = baseStore.get(testNetConfigKey);
  const [isTestNetHidden, setTestNetHidden] = useState(Boolean(isConfigHideTestNet));
  const [isMenuOpened, toggleMenuOpen] = useState(false);
  const { setTestNetHiddenFlag } = useNetworkSwitcher();
  const styles = useStyles();

  useEffect(() => {
    setTestNetHiddenFlag(isTestNetHidden);
  }, [isTestNetHidden]);

  const onMenuItemClick = (value: boolean) => {
    toggleMenuOpen(false);
    setTestNetHidden(value);
  };

  return (
    <NetworkSwitcherWrapper>
      <ClickAwayListener onClickAway={() => toggleMenuOpen(false)}>
        <MenuWrapper style={{ display: 'inline-block' }}>
          <NetworkSwitcherButton
            onClick={() => toggleMenuOpen(!isMenuOpened)}
            isActive={isMenuOpened}
          >
            {isTestNetHidden ? 'Mainnet Network' : 'Testnet Network'}
            {isMenuOpened
              ? <Icon color={isMenuOpened ? blue[900] : grey[600]} name="expand-more" fontSize="15px" className={styles.menuIcon} />
              : <Icon color={isMenuOpened ? blue[900] : grey[600]} name="expand-less" fontSize="15px" className={styles.menuIcon} />
            }
          </NetworkSwitcherButton>
          {isMenuOpened && (
            <Menu className={styles.menu}>
              <MenuItem className={styles.menuItem}>
                <MenuButton onClick={() => { onMenuItemClick(true); }}>
                  Mainnet Network
                </MenuButton>
              </MenuItem>
              <MenuItem className={styles.menuItem}>
                <MenuButton onClick={() => { onMenuItemClick(false); }}>
                  Testnet Network
                </MenuButton>
              </MenuItem>
            </Menu>
          )}
        </MenuWrapper>
      </ClickAwayListener>
    </NetworkSwitcherWrapper>
  );
};

export default connect(null, null)(NetworkSwitcher);
