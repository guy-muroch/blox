import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components/dist/styled-components.esm';

import Table from 'common/components/Table';
import { getNetwork } from '../../../selectors';
import BackButton from '../../common/BackButton';
import { Paragraph, Title, Warning } from '../../common';
import BloxTooltip from '../../../../../common/components/Tooltip';
import useProcessRunner from 'components/ProcessRunner/useProcessRunner';
import * as actionsFromKeyVault from '../../../../KeyVaultManagement/actions';
import { Subject } from '../../../../../backend/proccess-manager/subject.interface';
import { Observer } from '../../../../../backend/proccess-manager/observer.interface';
import { handlePageClick, compareFunction } from '../../../../../common/components/Table/service';
import ImportValidatorsProcess from '../../../../../backend/proccess-manager/import-validators.process';

import InfoImage from '../../../../../assets/images/info.svg';
import ArrowForwardImage from '../../../../../assets/images/arrow-forward.svg';

const Wrapper = styled.div`
  width: 100%;
  max-width:560px;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: Avenir;
  font-size: 16px;
  font-weight: 500;
`;

const TableWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  font-family: Avenir;
  font-size: 16px;
  font-weight: 500;
`;

const Image = styled.img`
  width: 16px;
  height: 16px;
  margin: 0px 6px 2px 2px;
`;

const TextField = styled.input<{ error: string }>`
  height: 40px;
  color:${({theme, disabled}) => disabled ? theme.gray400 : theme.gray600};
  font-size: 14px;
  width: 182px;
  font-weight: 500;
  border-radius: 4px;
  border: solid 1px ${({theme, error}) => error ? theme.destructive600 : theme.gray300};
  padding:8px 32px 8px 12px;
  outline: none;
  &:focus {
    border: solid 1px ${({theme, error}) => error ? theme.destructive600 : theme.primary900};
  }
`;

const ErrorMessage = styled.span`
  font-size: 12px;
  font-weight: 900;
  line-height: 1.67;
  color: ${({theme}) => theme.destructive600};
`;

type ArrowButtonProps = {
  disabled: boolean,
  onClick: (event) => void
};

const ArrowButtonWrapper = styled.button`
  cursor: pointer;
  width: 45px;
  height: 40px;
  margin-left: 4px;
  padding: 4px 6px 4px 7px;
  text-align: center;
  border-radius: 4px;
  background-color: ${({theme, disabled}) => disabled ? theme.gray400 : theme.primary900};
  border: 0;
  color: white;
`;

const ArrowButton = ({ disabled, onClick }: ArrowButtonProps) => {
  const arrowImageStyle = { margin: 'auto', width: 32, height: 32 };
  return (
    <ArrowButtonWrapper
      disabled={disabled}
      onClick={onClick}
    >
      <Image src={ArrowForwardImage} style={arrowImageStyle} />
    </ArrowButtonWrapper>
  );
};

/**
 * Listen for validators
 */
class GeneratedValidatorsListener implements Observer {
  private readonly setGeneratedValidators: any;
  private validators: any[];

  constructor(setGeneratedValidators: any) {
    this.setGeneratedValidators = setGeneratedValidators;
  }

  public update(_subject: Subject, payload: any) {
    if (payload.validators) {
      this.validators = payload.validators;
    }

    switch (payload.state) {
      case 'completed':
        this.validators && this.setGeneratedValidators(this.validators.reverse());
        break;
    }
  }
}

const ImportValidators = (props: Props) => {
  const { isLoading, isDone, processData, error, startProcess, clearProcessState } = useProcessRunner();
  const { page, setPage, setStep, selectedNetwork } = props;
  const [validatorsNumber, setValidatorsNumber] = useState(0);
  const [confirmedValidatorsNumber, confirmValidatorsNumber] = useState(false);
  const [validatorsNumberError, setValidatorsNumberError] = useState('');
  const [confirmedValidatorsList, confirmValidatorsList] = useState(false);
  const [validatorsNumberButtonDisabled, setValidatorsNumberButtonDisabled] = useState(true);
  const [finishedImport, setFinishedImport] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [generatedValidators, setGeneratedValidators] = useState([]);
  const [pagedValidators, setPagedValidators] = useState([]);

  /**
   * Generating validators
   */
  const generateValidators = async () => {
    const importValidatorsProcess = new ImportValidatorsProcess(validatorsNumber);
    const listener = new GeneratedValidatorsListener(setGeneratedValidators);
    importValidatorsProcess.subscribe(listener);
    try {
      await importValidatorsProcess.run();
    } catch (e) {
      console.error(e);
      setGeneratedValidators([]);
    }
  };

  useEffect(() => {
    // Confirm validators number button
    setValidatorsNumberButtonDisabled(!(!validatorsNumberError && validatorsNumber > 0 && validatorsNumber <= 100));

    // Error about entered validators number
    if (validatorsNumber > 100) {
      setValidatorsNumberError('Import is limited to 100 validators');
    } else {
      setValidatorsNumberError('');
    }

    if (!paginationInfo) {
      onPageClick(0);
    }
  }, [validatorsNumber, validatorsNumberError, confirmedValidatorsNumber, generatedValidators]);

  /**
   * Back button handler for all the steps
   */
  const onBackButtonClick = () => {
    setPage(page - 1);
  };

  const onValidatorsNumberInput = (event) => { setValidatorsNumber(Math.abs(event.target.value)); };

  /**
   * User confirmed validators number - now we've to generate them in CLI
   */
  const onValidatorsNumberButtonClick = async () => {
    await (!validatorsNumberError && confirmValidatorsNumber(true));
    await generateValidators();
  };

  type ImportValidatorsStepProps = {
    show: boolean
  };

  /**
   * Select number of validators to be imported
   *
   * @param show
   * @constructor
   */
  const EnterValidatorsNumber = ({ show }: ImportValidatorsStepProps) => {
    if (!show) {
      return null;
    }
    return (
      <>
        <Warning style={{ marginBottom: '34px'}} text={'In order to avoid slashing, make sure to stop attesting with different providers before importing.'} />
        <Paragraph>
          All validators created or imported during our ‘early bird’ promotion will not be charged until phase 1.5.
          <BloxTooltip title="All validators created or imported during this promotion period will not pay service fees until Phase 1.5 when transfers are enabled, or for up to 2 years, whichever happens first." arrow>
            <Image src={InfoImage} />
          </BloxTooltip>
        </Paragraph>
        <Paragraph>
          Validators will be imported in chronological order, according to their creation date.
          <BloxTooltip title="Ex: if you have a total of 6 validators and would like to transfer 4, the first 4 validators that you created will be the ones imported." arrow>
            <Image src={InfoImage} />
          </BloxTooltip>
        </Paragraph>

        <Paragraph>
          <TextField
            id="validators-number"
            type={'number'}
            value={validatorsNumber || ''}
            placeholder={'# of validator(s)'}
            onChange={onValidatorsNumberInput}
            error={validatorsNumberError}
            autoFocus
          />
          <ArrowButton
            disabled={validatorsNumberButtonDisabled}
            onClick={onValidatorsNumberButtonClick}
          />
          <br />
          {validatorsNumberError && <ErrorMessage>{validatorsNumberError}</ErrorMessage>}
        </Paragraph>
      </>
    );
  };

  /**
   * Validators list pagination
   *
   * @param offset
   */
  const onPageClick = (offset) => {
    const PAGE_SIZE = 10;
    handlePageClick(generatedValidators, offset, setPagedValidators, setPaginationInfo, PAGE_SIZE);
  };

  /**
   * Validators list to import
   *
   * @param show
   * @constructor
   */
  const ImportedValidatorsList = ({ show }: ImportValidatorsStepProps) => {
    if (!show) {
      return null;
    }

    const tableColumns = [
      {
        key: 'name',
        title: '#',
        width: '10%',
        justifyContent: 'flex-start',
        compareFunction: (a, b, dir) => compareFunction('name', a, b, dir, 'string'),
        valueRender: (index) => index.replace('account-', '').padStart(3, '0'),
      },
      {
        key: 'validationPubKey',
        title: 'Validator',
        width: '90%',
        justifyContent: 'flex-end',
        compareFunction: (a, b, dir) => compareFunction('validationPubKey', a, b, dir, 'string'),
        valueRender: (validator) => `0x${validator}`
      }
    ];

    return (
      <>
        <Paragraph>List of Validator(s) to be imported:</Paragraph>
        <TableWrapper>
          <Table
            data={generatedValidators}
            columns={tableColumns}
            withHeader
            onPageClick={onPageClick}
            isPagination
            paginationInfo={paginationInfo}
          />
        </TableWrapper>
      </>
    );
  };

  return (
    <Wrapper>
      <BackButton onClick={onBackButtonClick} />
      <Title>Validator Selection</Title>
      <EnterValidatorsNumber show={!confirmedValidatorsNumber} />
      <ImportedValidatorsList show={confirmedValidatorsNumber && !finishedImport} />
    </Wrapper>
  );
};

const mapStateToProps = (state: State) => ({
  selectedNetwork: getNetwork(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  keyVaultActions: bindActionCreators(actionsFromKeyVault, dispatch),
});

type Props = {
  page: number;
  network: string;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
  processData?: Record<string, any> | null;
  keyVaultActions: any;
  selectedNetwork: string;
};

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(ImportValidators);
