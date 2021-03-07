import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ModalTemplate, Button } from '~app/common/components';
import { getModalText } from '~app/components/Dashboard/selectors';
import { Title, Description, SmallText } from '~app/common/components/ModalTemplate/components';
import image from '../Wizard/assets/img-key-vault-inactive.svg';

const defaultText = `Due to KeyVault inactivity, your validators are not operating.
                    To fix this issue, we will restart your KeyVault.
                    If unsuccessful, a quick reinstall is required.`;

const WelcomeModal = ({onClick, onClose, text}) => {
  const textToShow = text !== '' ? text : defaultText;
  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Title>Reactivating your KeyVault</Title>
      <Description>{textToShow}</Description>
      <SmallText />
      <Button onClick={onClick}>Reactivate KeyVault</Button>
    </ModalTemplate>
  );
};

WelcomeModal.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
};

const mapStateToProps = (state) => ({
  text: getModalText(state),
});

export default connect(mapStateToProps)(WelcomeModal);
