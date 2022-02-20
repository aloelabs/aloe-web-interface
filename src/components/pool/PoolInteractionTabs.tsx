import React from 'react';
import { Tab } from '@headlessui/react';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import { classNames } from '../../util/ClassNames';
import DepositTab from './DepositTab';
import WithdrawTab from './WithdrawTab';

export type PoolInteractionTabsProps = {
  poolData: BlendPoolMarkers;
};

export default function PoolInteractionTabs(props: PoolInteractionTabsProps) {
  return (
    <div className='rounded-md border-2 border-grey-200 w-full p-4'>
      <Tab.Group defaultIndex={0}>
        <Tab.List className='flex p-1 space-x-1 bg-grey-0 rounded-md'>
          {['Deposit', 'Withdraw'].map((tabName) => (
            <Tab
              key={tabName}
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm leading-5 m-0.5 font-medium rounded-lg',
                  'focus:border-none',
                  selected
                    ? 'bg-grey-200 text-grey-1000'
                    : 'text-grey-700 hover:bg-grey-75 hover:text-grey-800'
                )
              }
            >
              <div>{tabName}</div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <DepositTab poolData={props.poolData} />
          </Tab.Panel>
          <Tab.Panel>
            <WithdrawTab poolData={props.poolData} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
