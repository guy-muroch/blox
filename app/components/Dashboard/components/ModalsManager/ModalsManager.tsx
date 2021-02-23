import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as selectors from '../../selectors';
import { MODAL_TYPES } from '../../constants';
import * as actionsFromDashboard from '../../actions';
import useDashboardData from '../../useDashboardData';
import * as actionsFromUser from '../../../User/actions';
import * as actionsFromWizard from '../../../Wizard/actions';
import ActiveValidatorModal from '../../../ActiveValidatorModal';
import * as actionsFromAccounts from '../../../Accounts/actions';
import { getActiveValidators } from '../../../EventLogs/selectors';
import { KeyVaultReactivation, KeyVaultUpdate, DepositInfoModal, AccountRecovery } from '../../..';
import { PasswordModal, FailureModal, ThankYouModal, ConfirmationModal } from '../../../KeyVaultModals';

import imageImportFailed from '../../../Wizard/assets/img-import-failed.svg';

const ModalsManager = (props: Props) => {
  const { dashboardActions, wizardActions, accountsActions, userActions,
    showModal, modalType, onSuccess, activeValidators, modalData } = props;
  const { clearModalDisplayData, setModalDisplay } = dashboardActions;
  const { loadWallet, setFinishedWizard } = wizardActions;
  const { loadAccounts } = accountsActions;
  const { loadUserInfo } = userActions;
  const { loadDashboardData } = useDashboardData();

  const onPasswordSuccess = () => {
    clearModalDisplayData();
    onSuccess();
  };

  const onKeyVaultProcessSuccess = async () => {
    await loadWallet();
    await clearModalDisplayData();
    await loadDashboardData();
  };

  const onAccountRecoverySuccess = async () => {
    setFinishedWizard(true);
    loadUserInfo();
    loadWallet();
    loadAccounts();
    clearModalDisplayData();
    await loadDashboardData();
  };

  if (showModal) {
    switch (modalType) {
      case MODAL_TYPES.PASSWORD:
        return (
          <PasswordModal
            onClick={onPasswordSuccess}
            onClose={() => clearModalDisplayData()}
          />
        );
      case MODAL_TYPES.REACTIVATION:
        return (
          <KeyVaultReactivation
            onSuccess={() => onKeyVaultProcessSuccess()}
            onClose={() => clearModalDisplayData()}
          />
        );
      case MODAL_TYPES.UPDATE:
        return (
          <KeyVaultUpdate
            onSuccess={() => onKeyVaultProcessSuccess()}
            onClose={() => clearModalDisplayData()}
          />
        );
      case MODAL_TYPES.DEPOSIT_INFO:
        return <DepositInfoModal onClose={() => clearModalDisplayData()} />;
      case MODAL_TYPES.ACTIVE_VALIDATOR:
        return activeValidators.length > 0 && (
          <ActiveValidatorModal
            onClose={() => clearModalDisplayData()}
            activeValidators={activeValidators}
          />
        );
      case MODAL_TYPES.DEVICE_SWITCH:
      case MODAL_TYPES.FORGOT_PASSWORD:
        return (
          <AccountRecovery
            onSuccess={() => onAccountRecoverySuccess()}
            onClose={() => clearModalDisplayData()}
            type={modalType}
          />
        );
      case MODAL_TYPES.VALIDATORS_IMPORT_FAILED:
        return (
          <FailureModal
            title="Failed to Import"
            subtitle="Please contact our support to help with the import."
            customImage={imageImportFailed}
            onClick={() => {
              setModalDisplay({ show: true, type: MODAL_TYPES.VALIDATORS_IMPORT_FAILED_THANKS });
            }}
          />
        );
      case MODAL_TYPES.VALIDATORS_IMPORT_FAILED_THANKS:
        return (
          <ThankYouModal
            onClose={async () => {
              setFinishedWizard(true);
              await loadDashboardData();
              clearModalDisplayData();
            }}
            customImage={imageImportFailed}
          />
        );
      case MODAL_TYPES.UPDATE_KEYVAULT_REQUEST:
      case MODAL_TYPES.REACTIVATE_KEYVAULT_REQUEST:
        return (
          <ConfirmationModal
            text={modalData.text}
            confirmation={modalData.confirmation}
            onSuccess={modalData.onSuccess}
          />
        );
      default:
        return null;
    }
  }
  return null;
};

const mapStateToProps = (state) => ({
  showModal: selectors.getModalDisplayStatus(state),
  modalType: selectors.getModalType(state),
  modalText: selectors.getModalText(state),
  onSuccess: selectors.getModalOnSuccess(state),
  activeValidators: getActiveValidators(state),
  modalData: selectors.getModalData(state),
});

const mapDispatchToProps = (dispatch) => ({
  dashboardActions: bindActionCreators(actionsFromDashboard, dispatch),
  wizardActions: bindActionCreators(actionsFromWizard, dispatch),
  accountsActions: bindActionCreators(actionsFromAccounts, dispatch),
  userActions: bindActionCreators(actionsFromUser, dispatch),
});

type Props = {
  dashboardActions: Record<string, any>;
  wizardActions: Record<string, any>;
  accountsActions: Record<string, any>;
  userActions: Record<string, any>;
  showModal: boolean;
  modalType: string;
  modalText: string;
  onSuccess: () => void;
  activeValidators: [{ publicKey: string }],
  modalData: Record<string, any>;
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalsManager);
