import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  color: ${({theme}) => theme.gray800};
`;
const Img = styled.img`
    width:100%;
    max-height: 412px;
`;

const Image = ({url}) => (
  <Wrapper>
    <Img src={url} />
  </Wrapper>
  );

Image.propTypes = {
  url: PropTypes.string,
};

export default Image;
