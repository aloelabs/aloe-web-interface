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
    <div className='w-full p-4 rounded-md bg-grey-75'>
      <Tab.Group defaultIndex={0}>
        <Tab.List className='flex p-1 space-x-1 rounded-md border-2 border-grey-200'>
          {['Deposit', 'Withdraw'].map((tabName) => (
            <Tab
              key={tabName}
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm m-0.5 font-medium rounded-md',
                  'focus:border-none',
                  selected
                    ? 'bg-grey-200 text-grey-1000'
                    : 'text-grey-700 hover:bg-grey-50 hover:text-grey-800'
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
