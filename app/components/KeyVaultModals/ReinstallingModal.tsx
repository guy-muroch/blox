import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Log } from '~app/backend/common/logger/logger';
import * as wizardSelectors from '~app/components/Wizard/selectors';
import { ProcessLoader, ModalTemplate } from '~app/common/components';
import useProcessRunner from '~app/components/ProcessRunner/useProcessRunner';
import {
  Title,
  Description,
  SmallText,
  Wrapper
} from '~app/common/components/ModalTemplate/components';
import * as keyVaultSelectors from '~app/components/KeyVaultManagement/selectors';

enum ProcessName {
  UPGRADE = 'upgrade',
  REINSTALL = 'reinstall'
}

const logger = new Log('ReinstallingModal');

const getProcessName = (keyVaultCurrentVersion: string, keyVaultLatestVersion: string): ProcessName => {
  if (keyVaultCurrentVersion === keyVaultLatestVersion) {
    return ProcessName.REINSTALL;
  }
  const versionRegexp = /(v)?((?<major>\d+)\.)?((?<minor>\d+)\.)?(?<mod>\d+)$/mgi;
  const parsedVersions = {
    current: new RegExp(versionRegexp).exec(keyVaultCurrentVersion)?.groups ?? null,
    latest: new RegExp(versionRegexp).exec(keyVaultLatestVersion)?.groups ?? null
  };
  if (!parsedVersions.current?.major || !parsedVersions.latest?.major) {
    return ProcessName.UPGRADE;
  }
  if (parseInt(parsedVersions.latest.major, 10) > parseInt(parsedVersions.current.major, 10)) {
    return ProcessName.REINSTALL;
  }
  if (!parsedVersions.current?.minor || !parsedVersions.latest?.minor) {
    return ProcessName.UPGRADE;
  }
  if (parseInt(parsedVersions.latest.minor, 10) > parseInt(parsedVersions.current.minor, 10)) {
    return ProcessName.REINSTALL;
  }
  return ProcessName.UPGRADE;
};

const ReinstallingModal = (props: Props) => {
  const { isLoading, processMessage, isDone, isServerActive, processName,
    startProcess, clearProcessState, loaderPercentage } = useProcessRunner();
  const {
    title, description, move1StepForward, move2StepsForward,
    onClose, image, keyVaultCurrentVersion, keyVaultLatestVersion } = props;

  useEffect(() => {
    if (isDone) {
      clearProcessState();
      isServerActive ? move1StepForward() : move2StepsForward();
    }
    if (!isDone && !isLoading && !processMessage && !processName) {
      const name = getProcessName(keyVaultCurrentVersion, keyVaultLatestVersion);
      logger.debug(`Current Version: ${keyVaultCurrentVersion}`);
      logger.debug(`Latest Version: ${keyVaultLatestVersion}`);
      logger.debug(`Identified Process Name: ${name}`);
      startProcess(name, 'Checking KeyVault configuration...');
    }
  }, [isLoading, isDone, processMessage, keyVaultCurrentVersion, keyVaultLatestVersion]);

  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Title>{title}</Title>
      <Wrapper>
        {description && <Description>{description}</Description>}
        <ProcessLoader text={processMessage} precentage={loaderPercentage} />
      </Wrapper>
      <SmallText withWarning />
    </ModalTemplate>
  );
};

type Props = {
  image: string;
  title: string;
  keyVaultCurrentVersion: string;
  keyVaultLatestVersion: string;
  description?: string;
  move1StepForward: () => void;
  move2StepsForward: () => void;
  onClose?: () => void;
};

const mapStateToProps = (state: State) => ({
  keyVaultCurrentVersion: wizardSelectors.getWalletVersion(state),
  keyVaultLatestVersion: keyVaultSelectors.getLatestVersion(state),
});

type State = Record<string, any>;

export default connect(mapStateToProps, null)(ReinstallingModal);
