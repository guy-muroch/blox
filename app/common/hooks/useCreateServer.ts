import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useInjectSaga } from 'utils/injectSaga';

import passwordSaga from 'components/PasswordHandler/saga';
import { savePassword } from 'components/PasswordHandler/actions';
import useProcessRunner from 'components/ProcessRunner/useProcessRunner';

const passwordKey = 'password';

const useCreateServer = ({onStart, onSuccess}: Props) => {
  useInjectSaga({ key: passwordKey, saga: passwordSaga, mode: '' });
  const dispatch = useDispatch();

  const { isLoading, isDone, error, processName, processMessage,
          startProcess, clearProcessState, loaderPrecentage } = useProcessRunner();

  const [accessKeyId, setAccessKeyId] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const isButtonDisabled = !accessKeyId || !secretAccessKey || isLoading || (isDone && !error);
  const isPasswordInputDisabled = isLoading || isDone;

  useEffect(() => {
    if (!isLoading && isDone && !error) {
      clearProcessState();
      onSuccess && onSuccess();
    }
  }, [isLoading, isDone, error]);

  const onStartProcessClick = async () => {
    if (!isButtonDisabled && !processMessage && !processName) {
      dispatch(savePassword('temp'));
      const credentials: Credentials = { accessKeyId, secretAccessKey };
      await startProcess('install', 'Checking KeyVault configuration...', credentials);
      onStart && onStart();
    }
  };

  return { isLoading, error, processMessage, loaderPrecentage, accessKeyId, setAccessKeyId,
           secretAccessKey, setSecretAccessKey, onStartProcessClick, isPasswordInputDisabled, isButtonDisabled };
};

type Props = {
  onStart?: () => void;
  onSuccess?: () => void;
};

type Credentials = {
  accessKeyId: string;
  secretAccessKey: string;
};

export default useCreateServer;
