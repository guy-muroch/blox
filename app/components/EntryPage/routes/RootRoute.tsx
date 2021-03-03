import React from 'react';
import styled from 'styled-components';
import Wizard from '~app/components/Wizard';
import Dashboard from '~app/components/Dashboard';
import Header from '~app/components/common/Header';
import Content from '~app/components/EntryPage/routes/wrappers/Content';

const DashboardWrapper = styled.div`
  width: 100%;
  min-height: 100%;
  padding-top: 70px;
  background-color: #f7fcff;
`;

const WizardWrapper = styled.div`
  width: 100%;
  min-height: 100%;
  background-color: #f7fcff;
  display: grid;
`;

const RootRoute = ({ showDashboard, showWizard, renderProps }: RootRouteProps) => {
  return (
    <>
      {showDashboard && (
        <>
          <Header withMenu isDashboard />
          <Content>
            <DashboardWrapper>
              <Dashboard {...renderProps} />
            </DashboardWrapper>
          </Content>
        </>
      )}
      {showWizard && (
        <WizardWrapper>
          <Wizard {...renderProps} />
        </WizardWrapper>
      )}
    </>
  );
};

type RootRouteProps = {
  showDashboard: boolean;
  showWizard: boolean;
  renderProps: any;
};

export default RootRoute;
