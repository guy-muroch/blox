import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useRouting from '~app/common/hooks/useRouting';
import { openLocalDirectory } from '~app/common/service';
import Connection from '~app/backend/common/store-manager/connection';
import Button from '~app/components/common/Header/components/ProfileMenu/Button';
import { Menu, MenuWrapper, MenuItem, MenuItemSeparator, MenuButton } from '~app/common/components/Menu';
import {Icon} from "../../../../../common/components";

const Image = styled.img`
  width: 26px;
  height: 26px;
  border-radius: 50%;
`;

const Name = styled.span`
  color: ${({ theme }) => theme.gray800};
  padding: 4px 16px;
`;

const Email = styled.span`
  color: ${({ theme }) => theme.gray400};
  padding: 4px 16px;
`;

const ProfileMenu = forwardRef(
  ({ isOpen, toggleOpen, profile, logout }, ref) => {
    const canViewTestPage = () => {
      return Connection.db().exists('testPage');
    };

    const openLogsFolder = () => {
      openLocalDirectory('logs');
      toggleOpen(false);
    };

    const { email, name, picture } = profile;
    const { ROUTES } = useRouting();
    const testPageIconStyle = {
      display: 'flex',
      float: 'left',
      marginRight: 5
    };
    const menuButtonTextStyle = { display: 'flex' };

    return (
      <MenuWrapper ref={ref}>
        <Button isOpen={isOpen} onClick={() => toggleOpen(!isOpen)}>
          <Image src={picture} />
        </Button>
        {isOpen && (
          <Menu>
            <MenuItem style={{ paddingTop: 10 }}>
              <Name>{name}</Name>
              <Email>{email}</Email>
            </MenuItem>
            <MenuItemSeparator />
            {canViewTestPage() && (
              <MenuItem>
                <MenuButton>
                  <Link to={ROUTES.TEST_PAGE}>
                    <Icon name="blox-icon-60-x-60" color="primary600" fontSize="18px" style={testPageIconStyle} />
                    <span style={menuButtonTextStyle}>Test page</span>
                  </Link>
                </MenuButton>
              </MenuItem>
            )}
            <MenuItem>
              <MenuButton onClick={openLogsFolder}>
                Open Logs Folder
              </MenuButton>
            </MenuItem>
            <MenuItem>
              <MenuButton onClick={logout}>Log Out</MenuButton>
            </MenuItem>
          </Menu>
        )}
      </MenuWrapper>
    );
  },
);

ProfileMenu.propTypes = {
  isOpen: PropTypes.bool,
  toggleOpen: PropTypes.func,
  profile: PropTypes.object,
  logout: PropTypes.func,
};

export default ProfileMenu;
