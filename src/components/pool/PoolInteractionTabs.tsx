import React, { Fragment } from 'react';
import { Tab } from '@headlessui/react';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import DepositTab from './DepositTab';
import WithdrawTab from './WithdrawTab';
import tw from 'twin.macro';
import styled from 'styled-components';
import ConnectWallet from './ConnectWallet';
import { OffChainPoolStats } from '../../data/PoolStats';
import SwapTab from './SwapTab';
import { isPoolDeprecated } from '../../util/Pool';

export const MODAL_BLACK_TEXT_COLOR = 'rgba(7, 14, 18, 1)';

const Wrapper = styled.div`
  ${tw`rounded-md`}
  width: 100%;
  // max-width: 500px;
  background-color: rgba(13, 23, 30, 1);
`;

const TabButton = styled.button`
  ${tw`w-full py-2.5`}
  position: relative;
  color: rgba(75, 105, 128, 1);
  height: 53px;
  /* font-family: 'ClashDisplay-Variable'; */
  font-size: 16px;
  font-weight: 600;
  line-height: 19.68px;
  &.selected {
    color: rgba(255, 255, 255, 1);
    &:before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      padding: 1.5px 1.5px 0px 1.5px;
      background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
    &:after {
      content: '';
      position: absolute;
      z-index: 20;
      padding-bottom: 1.5px;
      bottom: -1.5px;
      left: 1.75px;
      width: calc(100% - 3px);
      background: rgba(13, 23, 30, 1);
    }
  }

  &:focus {
    outline: none;
  }
`;

const PanelsWrapper = styled.div`
  position: relative;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  &:before {
    content: '';
    position: absolute;
    z-index: 0;
    inset: 0;
    pointer-events: none;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    padding: 0px 1.5px 1.5px 1.5px;
    background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  &:after {
    content: '';
    position: absolute;
    z-index: 5;
    inset: 0;
    pointer-events: none;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    padding: 1.5px 0px 0px 0px;
    background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
`;

export type PoolInteractionTabsProps = {
  poolData: BlendPoolMarkers;
  walletIsConnected: boolean;
  offChainPoolStats: OffChainPoolStats | undefined;
};

export default function PoolInteractionTabs(props: PoolInteractionTabsProps) {
  const { offChainPoolStats } = props;
  const isDeprecated = isPoolDeprecated(props.poolData);
  return (
    <Wrapper>
      {!props.walletIsConnected && <ConnectWallet />}
      {props.walletIsConnected && (
        <Tab.Group>
          <Tab.List className='flex rounded-md'>
            {['Deposit', 'Withdraw', 'Swap'].map((tabName) => (
              <Tab key={tabName} as={Fragment}>
                {({ selected }) => (
                  <TabButton className={selected ? 'selected' : ''}>
                    {tabName}
                  </TabButton>
                )}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels as={Fragment}>
            <PanelsWrapper>
              <Tab.Panel>
                <DepositTab poolData={props.poolData} offChainPoolStats={offChainPoolStats} deprecated={isDeprecated} />
              </Tab.Panel>
              <Tab.Panel>
                <WithdrawTab poolData={props.poolData} offChainPoolStats={offChainPoolStats} />
              </Tab.Panel>
              <Tab.Panel>
                <SwapTab poolData={props.poolData} />
              </Tab.Panel>
            </PanelsWrapper>
          </Tab.Panels>
        </Tab.Group>
      )}
    </Wrapper>
  );
}
