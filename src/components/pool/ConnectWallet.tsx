import React from 'react';
import styled from 'styled-components';
import DepositIllustration from '../../assets/svg/deposit_illustration.svg';
import ConnectWalletButton from '../header/ConnectWalletButton';

const Wrapper = styled.div`
  position: relative;
  border-radius: 8px;
  padding: 24px;
  &:before {
    content: '';
    position: absolute;
    z-index: 30;
    inset: 0;
    pointer-events: none;
    border-radius: 8px;
    padding: 1.5px;
    background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
`;

const ConnectWalletHeader = styled.div`
  /* font-family: 'ClashDisplay-Variable'; */
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: rgba(255, 255, 255, 1);
`;

const ConnectWalletSubHeader = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: rgba(204, 223, 237, 1);
`;

export default function ConnectWallet() {
  return (
    <Wrapper>
      <div className='flex items-center justify-center'>
        <img src={DepositIllustration} alt='connect wallet illustrastion' />
      </div>
      <div className='flex flex-col gap-y-2 mb-8'>
        <ConnectWalletHeader>Connect your wallet to start investing with Aloe</ConnectWalletHeader>
        <ConnectWalletSubHeader>
          By investing with Aloe, you will be able to lorem ipsum something
          something
        </ConnectWalletSubHeader>
      </div>
      <ConnectWalletButton />
    </Wrapper>
  );
}
