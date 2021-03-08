import React from 'react';
import Lottie from 'lottie-web-react';
import styled from 'styled-components';
import animationData from '~app/assets/animations/confetti.json';

const Wrapper = styled.div`
  position: fixed;
  top: -65px;
  width: 100%;
`;

const defaultOptions = {
  name: 'confetti',
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
};

const confettiArray = [{ speed: 0.5 }, { speed: 0.6 }, { speed: 0.7 }];

const Confetti = ({ forDialog }: ConfettiProps) => {
  const confettiStyle = {
    zIndex: forDialog ? -1 : 2
  };
  return (
    <>
      {confettiArray.map((confetti, index) => (
        <Wrapper
          style={confettiStyle}
          key={index}>
          <Lottie
            options={defaultOptions}
            playingState="play"
            speed={confetti.speed}
          />
        </Wrapper>
      ))}
    </>
  );
};

type ConfettiProps = {
  forDialog: boolean
};

Confetti.defaultProps = {
  forDialog: false
};

export default Confetti;
