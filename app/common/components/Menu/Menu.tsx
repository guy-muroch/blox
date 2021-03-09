import styled from 'styled-components';

const Menu = styled.div`
  width: 240px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
  position: absolute;
  top: 32px;
  right: 0;
  box-shadow: 0 2px 4px 0 ${({ theme }) => theme.gray80015};
  border-radius: 4px;
`;

export default Menu;
