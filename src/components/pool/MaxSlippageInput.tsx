import { Tab } from '@headlessui/react';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { SectionLabel } from './DepositTab';
import InfoIcon from '../../assets/svg/info.svg';

const PREDEFINED_MAX_SLIPPAGE_OPTIONS = [
  {label: 'Low (5%)', value: '5.0'},
  {label: 'Med (10%)', value: '10.0'},
]

const SlippageTabsWrapper = styled.div`
  ${tw`w-full flex`}
  border: 1px solid rgba(26, 41, 52, 1);
  padding: 4px;
  border-radius: 8px;
`;

const SlippageButton = styled.button`
  ${tw`w-full flex justify-center items-center py-2 px-3`}
  height: 35px;
  color: rgba(75, 105, 128, 1);
  background-color: rgba(13, 23, 30, 1);
  flex: 1;
  border-radius: 8px;
  overflow: hidden;

  & span {
    font-size: 14px;
    font-weight: 700;
    line-height: 19px;
  }

  &.selected {
    background-color: rgba(26, 41, 52, 1);
    & span {
      background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
`;

const CustomSlippageInputWrapper = styled.div`
  ${tw`w-full flex px-3`}
  position: relative;
  flex: 1;
`;

const CustomSlippageInput = styled.input`
  ${tw`w-full h-full px-3`}
  position: absolute;
  left: 0;
  background-color: rgba(13, 23, 30, 1);
  flex: 1;
  font-size: 14px;
  font-weight: 700;
  line-height: 19px;
  border-radius: 8px;
  padding: 0px 24px 0px 12px;
  caret-color: rgba(82, 182, 154, 1);

  &:focus {
    outline: none;
  }

  &.selected {
    color: rgba(204, 223, 237, 1);
    text-align: left;
    background-color: rgba(26, 41, 52, 1);
  }

  &::placeholder {
    color: rgba(75, 105, 128, 1);
  }
`;

const CustomSlippagePercent = styled.span`
  position: absolute;
  right: 12px;
  top: calc(50% - 9.5px);
  font-size: 14px;
  font-weight: 700;
  line-height: 19px;
  background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SlippageMessage = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: #ccdfed;
`;

export type MaxSlippageInputProps = {
  updateMaxSlippage: (value: string) => void;
};

export default function MaxSlippageInput(props: MaxSlippageInputProps) {
  const { updateMaxSlippage } = props;
  return (
    <div className='w-full flex flex-col gap-y-2 mt-6'>
      <SectionLabel className='flex gap-x-2 mb-1'>
        Max Slippage <img src={InfoIcon} width={16} height={16} alt='info' />
      </SectionLabel>
      <Tab.Group>
        <Tab.List>
          <SlippageTabsWrapper>
            {PREDEFINED_MAX_SLIPPAGE_OPTIONS.map(({ label, value }) => (
              <Tab as={Fragment} key={value}>
                {({ selected }) => (
                  <SlippageButton
                    className={selected ? 'selected' : ''}
                    onClick={() => updateMaxSlippage(value)}
                  >
                    <span>{label}</span>
                  </SlippageButton>)
                }
              </Tab>
            ))}
            <Tab as={Fragment} key='Custom'>
              {({ selected }) => {
                if (selected) {
                  return (
                    <>
                      <CustomSlippageInputWrapper>
                        <CustomSlippageInput
                          onChange={(e) => {
                            let newValue =
                              e.target.value !== '' ? e.target.value : '0';
                              updateMaxSlippage(newValue);
                          }}
                          type='text'
                          className={selected ? 'selected' : ''}
                          autoFocus={true}
                          placeholder='0'
                        />
                        <CustomSlippagePercent>%</CustomSlippagePercent>
                      </CustomSlippageInputWrapper>
                    </>
                  );
                } else {
                  return (
                    <SlippageButton
                      onClick={() => updateMaxSlippage('0')}
                    >
                      <span>Custom</span>
                    </SlippageButton>
                  );
                }
              }}
            </Tab>
          </SlippageTabsWrapper>
        </Tab.List>
        <Tab.Panels as={Fragment}>
          <Tab.Panel>
            <SlippageMessage>
              <strong>Low slippage</strong> means lorem ipsum doler ilet
              something something something.
            </SlippageMessage>
          </Tab.Panel>
          <Tab.Panel>
            <SlippageMessage>
              <strong>Medium slippage</strong> means lorem ipsum doler ilet
              something something something.
            </SlippageMessage>
          </Tab.Panel>
          <Tab.Panel>
            <SlippageMessage>
              <strong>Set a custom slippage</strong> means lorem ipsum doler
              ilet something something something.
            </SlippageMessage>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
