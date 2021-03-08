import React from 'react';
import PropTypes from 'prop-types';
import { Button, ModalTemplate } from '~app/common/components';
import { MODAL_TYPES } from '~app/components/Dashboard/constants';
import { Title, Description } from '~app/common/components/ModalTemplate/components';
import image from '../Wizard/assets/img-key-vault-inactive.svg';

const ThankYouModal = ({ onClose, type, customImage }) => {
  const showButton = (type !== MODAL_TYPES.DEVICE_SWITCH) && (type !== MODAL_TYPES.FORGOT_PASSWORD);
  return (
    <ModalTemplate onClose={onClose} image={customImage || image}>
      <Title>Thank You!</Title>
      <Description>
        We will contact you as soon as possible
      </Description>
      {showButton && (<Button onClick={onClose}>Close</Button>)}
    </ModalTemplate>
  );
};

ThankYouModal.propTypes = {
  onClose: PropTypes.func,
  type: PropTypes.string,
  customImage: PropTypes.any
};

ThankYouModal.defaultProps = {
  onClose: () => {},
  type: null,
  customImage: null
};

export default ThankYouModal;
