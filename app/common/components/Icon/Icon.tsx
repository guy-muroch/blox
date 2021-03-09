import React from 'react';
import styled from 'styled-components';

const RegularIcon = styled.i<{ fontSize: string, isDisabled: boolean, color?: string }>`
  font-size: ${({ fontSize }) => fontSize || '12px'};
  display: flex;
  align-items: center;
  color: ${({ theme, color, isDisabled }) => isDisabled ? theme.gray400 : (color && theme[color]) || color || '#ffffff'};
`;

const ClickableIcon = styled(RegularIcon)`
  cursor: pointer;
  :hover {
    color: ${({ theme, color, isDisabled }) => isDisabled ? theme.gray400 : (color && theme.primary700) || color || '#ffffff'};
  }
  :active {
    color: ${({ theme, color, isDisabled }) => isDisabled ? theme.gray400 : (color && theme.primary800) || color || '#ffffff'};
  }
`;

const Icon = (props: Props) => {
  const { name, color, fontSize, onClick, isDisabled, style, className } = props;

  if (onClick && typeof onClick === 'function') {
    return (
      <ClickableIcon
        style={style || {}}
        className={`icon-${name} ${className || ''}`}
        color={color}
        fontSize={fontSize}
        onClick={onClick}
        isDisabled={isDisabled}
      />
    );
  }

  return (
    <RegularIcon
      style={style || {}}
      className={`icon-${name} ${className || ''}`}
      color={color}
      fontSize={fontSize}
      isDisabled={isDisabled}
    />
  );
};

type Props = {
  name: string;
  isDisabled?: boolean;
  fontSize: string;
  className?: string;
  color?: string;
  onClick?: () => void;
  style?: object;
};

export default Icon;
