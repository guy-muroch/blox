import React from 'react';
import styled from 'styled-components';
import Icon from '../Icon';

const Wrapper = styled.div<{ fontSize: string }>`
  display:flex;
  color:${({theme, color}) => theme[color]};
  font-size:${({fontSize}) => fontSize};
`;

const EtherNumber = ({value, color, fontSize}: Props) => {
  return (
    <Wrapper color={color} fontSize={fontSize}>
      <Icon name={'eth-icon-colors'} fontSize={fontSize} color={color} />
      {value}
    </Wrapper>
  );
};

type Props = {
  value: number;
  color: string;
  fontSize: string;
};

export default EtherNumber;
