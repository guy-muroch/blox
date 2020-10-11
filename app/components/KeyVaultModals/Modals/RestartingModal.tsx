import React, { useEffect } from 'react';
import useProcessRunner from 'components/ProcessRunner/useProcessRunner';

import { ProcessLoader } from 'common/components';
import { Title, SmallText } from '..';
import ModalTemplate from '../ModalTemplate';

import image from '../../Wizard/assets/img-key-vault-inactive.svg';

const RestartingModal = (props: Props) => {
  const { isLoading, processMessage, isDone, isServerActive, processName,
    startProcess, clearProcessState, loaderPrecentage} = useProcessRunner();

  const { move1StepForward, move2StepsForward, onClose } = props;

  useEffect(() => {
    if (isDone) {
      clearProcessState();
      isServerActive ? move1StepForward() : move2StepsForward();
    }
    if (!isDone && !isLoading && !processMessage && !processName) {
      startProcess('restart', 'Checking KeyVault configuration...', null);
    }
  }, [isLoading, isDone, processMessage]);

  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Title>Restarting KeyVault</Title>
      <ProcessLoader text={processMessage} precentage={loaderPrecentage} />
      <SmallText withWarning />
    </ModalTemplate>
  );
};

type Props = {
  move1StepForward: () => void;
  move2StepsForward: () => void;
  onClose: () => void;
};

export default RestartingModal;
