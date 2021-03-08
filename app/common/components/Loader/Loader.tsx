import React from 'react';
import styled from 'styled-components';
import { LinearProgress } from '@material-ui/core';
import Header from '~app/components/common/Header';
import Spinner from '~app/common/components/Spinner';

const Wrapper = styled.div`
  width:100%;
  height:100%;
  position:fixed;
  top: 0;
  left: 0;
  background-color: #F7FCFF;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SpinnerWrapper = styled.div`
  width:90px;
  height:90px;
  border-radius:50%;
  background-color:${({theme}) => theme.gray100};
  display:flex;
  align-items:center;
  justify-content:center;
`;

const StyledLinearProgress = styled((props) => (
  <LinearProgress
    classes={{ loader: props.classes, indeterminate: 'progressbar' }}
    {...props}
  />
))`
  &.progressbar {
    width: 100%;
    height: 8px;
    position: absolute;
    bottom: 0;
    background-color: ${(props) => props.theme.gray200};
    .MuiLinearProgress-barColorPrimary {
      background-color: ${(props) => props.theme.primary900};
    }
  }
`;

const Loader = (props: LoaderProps) => {
  const { withSpinner, withHeader, withHeaderMenu, withHeaderProfileMenu } = props;
  return (
    <Wrapper>
      { withHeader && (
        <Header
          withMenu={withHeaderMenu}
          hideProfileMenu={!withHeaderProfileMenu}
        />
      )}
      { withSpinner && (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      )}
      <StyledLinearProgress {...props} />
    </Wrapper>
  );
};

Loader.defaultProps = {
  withSpinner: false,
  withHeader: true,
  withHeaderMenu: false,
  withHeaderProfileMenu: false
};

type LoaderProps = {
  withSpinner: boolean;
  withHeader: boolean;
  withHeaderMenu: boolean;
  withHeaderProfileMenu: boolean;
};

export default Loader;
