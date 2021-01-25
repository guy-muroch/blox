import React, { useState } from 'react';
import styled from 'styled-components/dist/styled-components.esm';

import tableColumns from './table-columns';
import Table from 'common/components/Table';
import { Paragraph, Link } from '../../../common';
import { Checkbox, Spinner } from '../../../../../../common/components';
import useProcessRunner from '../../../../../ProcessRunner/useProcessRunner';
import { handlePageClick } from '../../../../../../common/components/Table/service';

const TableWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  font-family: Avenir, serif;
  font-size: 16px;
  font-weight: 500;
`;

const ButtonWrapper = styled.div`
  margin-top:41px;
  margin-bottom:41px;
`;

const Button = styled.button`
  width: 238px;
  height: 40px;
  font-size: 14px;
  font-weight: 900;
  display:flex;
  align-items:center;
  justify-content:center;
  background-color: ${({theme, isDisabled}) => isDisabled ? theme.gray400 : theme.primary900};
  border-radius: 6px;
  color:${({theme}) => theme.gray50};
  border:0;
  cursor:${({isDisabled}) => isDisabled ? 'default' : 'pointer'};
`;

type ImportedValidatorsListProps = {
  show: boolean,
  validators: any[],
  onDone: () => void
};

/**
 * Table with list of imported validators
 *
 * @param show
 * @param validators
 * @param onDone
 * @constructor
 */
const ImportedValidatorsList = ({ show, validators, onDone }: ImportedValidatorsListProps) => {
  // Don't show component if not allowed to show or nothing to show
  if (!show || !validators || !validators.length) {
    return null;
  }

  const PAGE_SIZE = 5;
  const checkboxStyle = { marginRight: 5 };
  const checkboxLabelStyle = { fontSize: 12 };
  const privacyPolicyLink = 'https://www.bloxstaking.com/privacy-policy/';
  const serviceAgreementLink = 'https://www.bloxstaking.com/license-agreement/';

  const { isLoading } = useProcessRunner();
  const [pagedValidators, setPagedValidators] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [isValidatorsOfflineCheckbox, setValidatorsOfflineCheckbox] = useState(false);
  const [isAgreementReadCheckbox, setAgreementReadCheckbox] = useState(false);

  /**
   * Table navigation handler
   *
   * @param offset
   */
  const onPageClick = (offset) => {
    handlePageClick(validators, offset, setPagedValidators, setPaginationInfo, PAGE_SIZE);
  };

  /**
   * Checkboxes should not react on links clicks
   *
   * @param event
   */
  const onLinkClick = (event) => { event.stopPropagation(); };

  /**
   * Final import step, when all validators are shown
   * and user checked all checkboxes and pressed Continue button
   *
   * Here should be following actions:
   *  1. Save validators in KeyVault
   *  2. Create user account
   *  3. Redirect to dashboard where all validators will be displayed
   */
  const onCreateAccountButtonClick = () => {
    // TODO: create account

    onDone();
  };

  if (!paginationInfo) {
    onPageClick(0);
  }

  return (
    <>
      <Paragraph>List of Validator(s) to be imported:</Paragraph>
      <TableWrapper>
        <Table
          data={pagedValidators}
          columns={tableColumns}
          withHeader
          onPageClick={onPageClick}
          isPagination
          paginationInfo={paginationInfo}
        />
      </TableWrapper>

      <Checkbox
        checked={isValidatorsOfflineCheckbox}
        onClick={() => { setValidatorsOfflineCheckbox(!isValidatorsOfflineCheckbox); }}
        checkboxStyle={checkboxStyle}
        labelStyle={checkboxLabelStyle}
      >
        I&apos;m aware that before importing, to avoid slashing risks, my validator needs to be offline
      </Checkbox>

      <Checkbox
        checked={isAgreementReadCheckbox}
        onClick={() => { setAgreementReadCheckbox(!isAgreementReadCheckbox); }}
        checkboxStyle={checkboxStyle}
        labelStyle={checkboxLabelStyle}
      >
        I agree to Blox’s&nbsp;
        <Link
          onClick={onLinkClick}
          href={privacyPolicyLink}
        >
          Privacy Policy
        </Link>
        &nbsp;and&nbsp;
        <Link
          onClick={onLinkClick}
          href={serviceAgreementLink}
        >
          License and Service Agreement
        </Link>
      </Checkbox>

      <ButtonWrapper>
        <Button
          isDisabled={!(isValidatorsOfflineCheckbox && isAgreementReadCheckbox) || isLoading}
          onClick={onCreateAccountButtonClick}>
          Continue
        </Button>
        {isLoading && <Spinner />}
      </ButtonWrapper>
    </>
  );
};

export default ImportedValidatorsList;
