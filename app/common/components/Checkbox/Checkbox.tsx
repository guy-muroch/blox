import React from 'react';
import { Icon } from 'common/components';
import styled from 'styled-components/dist/styled-components.esm';

const Wrapper = styled.div<{ checked: boolean }>`
  width:18px;
  height:18px;
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  border:${({theme}) => `${theme.primary900} 1px solid`};
  background-color:${({theme, checked}) => checked ? theme.primary900 : '#ffffff'};
  color:#ffffff;
  border-radius:3px;
  cursor:pointer;
`;

const Checkbox = ({ checked, onClick, style }: Props) => {
  return (
    <Wrapper checked={checked} onClick={() => onClick(!checked)} style={style || {}}>
      <Icon color={'white'} name={'check'} fontSize={'18px'} />
    </Wrapper>
  );
};

type Props = {
  checked: boolean;
  onClick: (checked: boolean) => void;
  style?: any
};

const CheckboxWrapper = styled.div`
  width: 100%;
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

type RequiredCheckboxProps = {
  checked: boolean,
  onClick: (event) => void,
  checkboxStyle?: object,
  labelStyle?: object,
  children: any
};

const RequiredCheckbox = ({ checked, onClick, checkboxStyle, labelStyle, children }: RequiredCheckboxProps) => {
  return (
    <CheckboxWrapper>
      <Checkbox
        checked={checked}
        onClick={onClick}
        style={checkboxStyle || {}}
      />
      <div
        role="checkbox"
        tabIndex={-1}
        style={labelStyle || {}}
        onClick={onClick}
        onKeyDown={onClick}
        aria-checked={checked}
      >
        {children}
      </div>
    </CheckboxWrapper>
  );
};

export default RequiredCheckbox;
