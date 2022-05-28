import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import ExecutionRiskIcon from '../../assets/svg/execution_risk.svg';
import BaseProtocolRiskIcon from '../../assets/svg/base_protocol_risk.svg';
import ImpermanentLossIcon from '../../assets/svg/impermanent_loss.svg';
import TokenAndBaseLayerRiskIcon from '../../assets/svg/token_and_base_layer_risk.svg';
import NextChevronActive from '../../assets/svg/next_chevron_active.svg';
import NextChevronInactive from '../../assets/svg/next_chevron_inactive.svg';
import PreviousChevronActive from '../../assets/svg/previous_chevron_active.svg';
import PreviousChevronInactive from '../../assets/svg/previous_chevron_inactive.svg';

const RISK_CARDS = [
  {
    title: 'Execution Risk',
    description:
      'Though Aloe Blend has been audited, there’s always a chance that something goes wrong. The contract code is immutable, and there is no failsafe by which Aloe Labs or anyone else can pause execution.',
    image: ExecutionRiskIcon,
  },
  {
    title: 'Base Protocol Risk',
    description:
      'Though Aloe Blend has been audited, there’s always a chance that something goes wrong. The contract code is immutable, and there is no failsafe by which Aloe Labs or anyone else can pause execution.',
    image: BaseProtocolRiskIcon,
  },
  {
    title: 'Impermanent Loss',
    description:
      'Though Aloe Blend has been audited, there’s always a chance that something goes wrong. The contract code is immutable, and there is no failsafe by which Aloe Labs or anyone else can pause execution.',
    image: ImpermanentLossIcon,
  },
  {
    title: 'Tokens and Base Layer Risk',
    description:
      'Though Aloe Blend has been audited, there’s always a chance that something goes wrong. The contract code is immutable, and there is no failsafe by which Aloe Labs or anyone else can pause execution.',
    image: TokenAndBaseLayerRiskIcon,
  },
];

const Wrapper = styled.div`
  ${tw`w-full flex`}
  background-color: rgba(13, 23, 30, 1);
  border-radius: 12px;
`;

const RiskImage = styled.img`
  width: 256px;
  height: 256px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  color: rgba(255, 255, 255, 1);
`;

const Description = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: rgba(130, 160, 182, 1);
`;

const NavigationButton = styled.button`
  ${tw`w-full flex items-center justify-center`}
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(26, 41, 52, 1);

  &:disabled {
    background-color: rgba(13, 23, 30, 1);
  }
`;

const NavigationDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(26, 41, 52, 1);

  &.active {
    width: 14px;
    border-radius: 100px;
    background-color: rgba(255, 255, 255, 1);
  }
`;

export default function RiskCard() {
  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
  const title = RISK_CARDS[currentCardIndex].title;
  const description = RISK_CARDS[currentCardIndex].description;
  const image = RISK_CARDS[currentCardIndex].image;
  const isPreviousButtonDisabled = currentCardIndex === 0;
  const isNextButtonDisabled = currentCardIndex === RISK_CARDS.length - 1;
  return (
    <Wrapper>
      <RiskImage src={image} />
      <div className='flex flex-col justify-between p-8'>
        <div className='flex flex-col gap-y-2'>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </div>
        <div className='flex items-center justify-between'>
          <NavigationButton disabled={isPreviousButtonDisabled} onClick={() => setCurrentCardIndex(currentCardIndex - 1)}>
            <img src={isPreviousButtonDisabled ? PreviousChevronInactive : PreviousChevronActive} alt='Previous' />
          </NavigationButton>
          <div className='flex items-center gap-x-2'>
            {RISK_CARDS.map((_riskCard, index) => (
              <NavigationDot className={index === currentCardIndex ? 'active' : ''} />
            ))}
          </div>
          <NavigationButton disabled={isNextButtonDisabled} onClick={() => {setCurrentCardIndex(currentCardIndex + 1)}}>
            <img src={isNextButtonDisabled ? NextChevronInactive : NextChevronActive} alt='Next' />
          </NavigationButton>
        </div>
      </div>
    </Wrapper>
  );
}
