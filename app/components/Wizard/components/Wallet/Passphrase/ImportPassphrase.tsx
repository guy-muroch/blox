import {getIsLoading, getMnemonic} from "../../../../KeyVaultManagement/selectors";
import {bindActionCreators} from "redux";
import * as actionsFromKeyvault from "../../../../KeyVaultManagement/actions";
import * as actionsFromPassword from "../../../../PasswordHandler/actions";
import {connect} from "react-redux";
import useCreatePassword from "../../../../../common/hooks/useCreatePassword";
import React, {useState} from "react";
import {useInjectSaga} from "../../../../../utils/injectSaga";
import keyvaultSaga from "../../../../KeyVaultManagement/saga";
import passwordSaga from "../../../../PasswordHandler/saga";
import {Icon} from "../../../../../common/components";
import Backup from "./components/Backup";
import {Regular} from "./components";
import {writeToTxtFile} from "./service";
import BackButton from "../../common/BackButton/BackButton";

const keyvaultKey = 'keyvaultManagement';
const passwordKey = 'password';

const ImportPassphrase = (props: Props) => {
  const {page, setPage, mnemonic, isLoading, keyvaultActions, passwordActions} = props;
  const {keyvaultLoadMnemonic, keyvaultSaveMnemonic} = keyvaultActions;
  const {replacePassword} = passwordActions;

  const {
    password, setPassword, confirmPassword, setConfirmPassword, showPasswordError,
    showConfirmPasswordError, onPasswordBlur, onConfirmPasswordBlur
  } = useCreatePassword();

  const [duplicatedMnemonic, setDuplicatedMnemonic] = useState('');
  const [showDuplicatedMnemonicError, setDuplicatedMnemonicErrorDisplay] = useState(false);
  const isButtonDisabled = !mnemonic;

  useInjectSaga({key: keyvaultKey, saga: keyvaultSaga, mode: ''});
  useInjectSaga({key: passwordKey, saga: passwordSaga, mode: ''});


  const onSaveAndConfirmClick = async () => {
    const canGenerate = canGenerateMnemonic();
    if (canGenerate) {
      await replacePassword(password);
      await keyvaultSaveMnemonic(duplicatedMnemonic);
      await !isButtonDisabled && setPage(page + 1);
    }
  };

  const hideBackupScreen = () => toggleBackupDisplay(false);

  const canGenerateMnemonic = () => {
    const mnemonicsAreEqual = mnemonic === duplicatedMnemonic;
    const passwordsAreEqual = password === confirmPassword;
    const passwordshaveMoreThan8Char = password.length >= 8 && confirmPassword.length >= 8;
    return mnemonicsAreEqual && passwordsAreEqual && passwordshaveMoreThan8Char;
  };

  const onDuplicateMnemonicBlur = () => {
    if (mnemonic !== duplicatedMnemonic) {
      setDuplicatedMnemonicErrorDisplay(true);
      return;
    }
    setDuplicatedMnemonicErrorDisplay(false);
  };

  const onBackButtonClick = () => {
    setPage(4)
  };
  return (
    <div>
      <BackButton onClick={onBackButtonClick}/>
      <Backup isImport={true} onNextButtonClick={onSaveAndConfirmClick} onBackButtonClick={hideBackupScreen}
              password={password} setPassword={setPassword} confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword} isSaveAndConfirmEnabled={canGenerateMnemonic}
              duplicatedMnemonic={duplicatedMnemonic} setDuplicatedMnemonic={setDuplicatedMnemonic}
              showDuplicatedMnemonicError={showDuplicatedMnemonicError}
              onDuplicateMnemonicBlur={onDuplicateMnemonicBlur}
              isLoading={isLoading} showPasswordError={showPasswordError}
              showConfirmPasswordError={showConfirmPasswordError}
              onPasswordBlur={onPasswordBlur} onConfirmPasswordBlur={onConfirmPasswordBlur}
      />
    </div>
  );
};

type Page = number;

type Props = {
  page: Page;
  setPage: (page: Page) => void;
  mnemonic: string;
  isLoading: boolean;
  keyvaultActions: Record<string, any>;
  passwordActions: Record<string, any>;
};


const mapStateToProps = (state) => ({
  isLoading: getIsLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  keyvaultActions: bindActionCreators(actionsFromKeyvault, dispatch),
  passwordActions: bindActionCreators(actionsFromPassword, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ImportPassphrase);
