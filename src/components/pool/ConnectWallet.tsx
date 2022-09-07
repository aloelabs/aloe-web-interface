import React from 'react';
import styled from 'styled-components';
import { useAccount, useEnsName } from 'wagmi';
import DepositIllustration from '../../assets/svg/deposit_illustration.svg';
import { Display, Text } from '../common/Typography';
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

export default function ConnectWallet() {
  const { address, connector: activeConnector } = useAccount();
  const { data: ensName } = useEnsName({ address });

  return (
    <Wrapper>
      <div className='flex items-center justify-center'>
        <img src={DepositIllustration} alt='connect wallet illustrastion' />
      </div>
      <div className='flex flex-col gap-y-2 mb-8'>
        <Display size='M' weight='semibold'>Connect your wallet to start investing with Aloe</Display>
        <Text size='S' weight='medium' color='rgba(204, 223, 237, 1)'>
          By investing with Aloe, you will be able to earn trading fees on Uniswap, collect interest from other protocols, and autonomously manage your portfolio.
        </Text>
      </div>
      <ConnectWalletButton address={address} ensName={ensName as string} activeConnector={activeConnector} buttonStyle='secondary' />
    </Wrapper>
  );
}
