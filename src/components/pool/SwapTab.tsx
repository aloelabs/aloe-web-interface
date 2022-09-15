import styled from 'styled-components';
import tw from 'twin.macro';
import { useSigner } from 'wagmi';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';

import { SwapWidget, Theme } from '@uniswap/widgets'
import '@uniswap/widgets/fonts.css'

export type DepositTabProps = {
  poolData: BlendPoolMarkers;
  // offChainPoolStats: OffChainPoolStats | undefined;
};

export const TabWrapper = styled.div`
  ${tw`flex flex-col items-center justify-center`}
  padding: 24px;
`;

export const SectionLabel = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: rgba(130, 160, 182, 1);
`;

const theme: Theme = {
  primary: '#FFF', // primary text color
  secondary: '#CCDFED', // secondary text color
  interactive: '#52B69A', // button color
  container: '#00000000', // overall background
  module: '#1A2934', // lower background
  accent: '#52B69A',
  outline: '#FFF',
  dialog: '#1A2934',
  fontFamily: 'Satoshi-Variable',
  borderRadius: 0.5,
  tokenColorExtraction: false,
}

export default function SwapTab(props: DepositTabProps) {
  const { data: signer } = useSigner();

  return (
    <TabWrapper>
      <SwapWidget
        provider={signer?.provider as any}
        hideConnectionUI={true}
        onConnectWalletClick={async () => {
          return false
        }}
        defaultInputTokenAddress={props.poolData.token0Address}
        defaultOutputTokenAddress={props.poolData.token1Address}
        tokenList={'https://tokens.coingecko.com/uniswap/all.json'}
        width={'100%'}
        theme={theme}
        />
    </TabWrapper>
  );
}
