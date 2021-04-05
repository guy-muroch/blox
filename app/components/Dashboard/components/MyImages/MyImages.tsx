import React, {useState} from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { CustomModal } from '../../../../common/components';
import BaseStore from '~app/backend/common/store-manager/base-store';
import { Image, LeftArrow, RightArrow} from './components';

const Wrapper = styled.div`
  width: 100%;
  margin-bottom:36px;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 500;
  line-height: 1.69;
  color: ${({theme}) => theme.gray800};
  margin-top: 0;
  margin-bottom: 20px;
`;
const Button = styled.button`
  width: 120px;
  height: 30px;
  font-weight: 900;
  align-items:center;
  color:white;
  margin-left:10px;
  justify-content:center;
  border-radius: 6px;
  border:0px;
  background-color:#2536b8; 
`;
const Input = styled.input`
  height: 21px;
  width: 250px;
  border: 0px;
  background-color: ${(props) => props.theme.gray50};
  box-shadow: inset 0px -2px ${(props) => props.theme.primary600};
  outline: none;
  font-size: 14px;
  color: ${(props) => props.theme.gray800};
  caret-color: ${(props) => props.theme.primary600};
`;

const baseStore: BaseStore = new BaseStore();

const MyImages = () => {
  const [text, setText] = useState('');
  const [showImages, setShowImages] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const addImage = (userText) => {
    const images = baseStore.get('images') || [];
    images.unshift(userText);
    baseStore.set('images', images);
    setText('');
  };
  const changeImage = (desiredIndex) => {
    if (desiredIndex >= 0 && desiredIndex < baseStore.get('images').length) {
      setCurrentImageIndex(desiredIndex);
    } else {
      setCurrentImageIndex(0);
    }
  }
  return (
    <Wrapper>
      <Title>My Images</Title>
      <Input value={text || ''} onChange={e => setText(e.target.value)}/>
      <Button onClick={() => addImage(text)}>+Add</Button>
      <Button onClick={() => setShowImages(true)}>See Images</Button>
     {(showImages && baseStore.get('images').length > 0) ?
        (
        <Wrapper>
        <CustomModal
        width={'700px'}
        height={'462px'}
        onClose={() => setShowImages(false)}>
        <Image url={baseStore.get('images')[currentImageIndex] || []}/>
        <LeftArrow currentImageIndex={currentImageIndex} onClick={changeImage}/>
        <RightArrow currentImageIndex={currentImageIndex} onClick={changeImage} />
        </CustomModal>
        </Wrapper>
        ) :
     null};
    </Wrapper>
  );
};



export default connect(null, null)(MyImages);
