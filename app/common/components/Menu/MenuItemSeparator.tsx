import styled from 'styled-components';

const MenuItemSeparator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.gray300};
  margin-top: 7px;
`;

export default MenuItemSeparator;
