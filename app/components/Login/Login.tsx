import React from 'react';
import styled from 'styled-components';
import { Left, Right } from './components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background-image: url('assets/images/bg_staking.jpg');
  background-size: contain;
`;

const Login = () => (
  <Wrapper>
    <Left />
    <Right />
  </Wrapper>
);

export default Login;
