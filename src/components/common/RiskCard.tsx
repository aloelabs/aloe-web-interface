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
import { Text } from './Typography';
import { RESPONSIVE_BREAKPOINT_SM } from '../../data/constants/Breakpoints';

const DESCRIPTION_TEXT_COLOR = 'rgba(130, 160, 182, 1)';

const Wrapper = styled.div`
  ${tw`w-full flex`}
  flex-direction: row;
  background-color: rgba(13, 23, 30, 1);
  border-radius: 12px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    flex-direction: column;
  }
`;

const RiskImage = styled.img`
  width: 256px;
  height: 256px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    margin: 0 auto;
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  color: rgba(255, 255, 255, 1);
`;

const NavigationButton = styled.button`
  ${tw`w-full flex items-center justify-center`}
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(26, 41, 52, 1);
  user-select: none;

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

const RiskBody = styled.div`
  ${tw`w-full flex flex-col justify-between`}
  padding: 32px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    padding-top: 8px;
  }
`;

const RiskInfo = styled.div`
  ${tw`flex flex-col gap-y-2`}

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    min-height: 120px;
  }
`;

const RISK_CARDS = [
  {
    title: <Title>Execution Risk</Title>,
    description:
      <Text size='S' weight='medium' color={DESCRIPTION_TEXT_COLOR}>Though Aloe Blend has been <a href="https://github.com/aloelabs/aloe-blend/blob/master/audits/aloe_1.1_signed.pdf" className='underline'>audited</a>, there’s always a chance that something goes wrong. The contract code is immutable, and there is no failsafe by which Aloe Labs or anyone else can pause execution.</Text>,
    image: ExecutionRiskIcon,
  },
  {
    title: <Title>Base Protocol Risk</Title>,
    description:
      <Text size='S' weight='medium' color={DESCRIPTION_TEXT_COLOR}>The underlying protocols (Uniswap and protocols used in silos) present risk from both their code and the potential for deleterious governance action.</Text>,
    image: BaseProtocolRiskIcon,
  },
  {
    title: <Title>Impermanent Loss</Title>,
    description:
      <Text size='S' weight='medium' color={DESCRIPTION_TEXT_COLOR}>This pool is subject to similar impermanent loss as a standard Uniswap V2 position.</Text>,
    image: ImpermanentLossIcon,
  },
  {
    title: <Title>Tokens and Base Layer Risk</Title>,
    description:
      <Text size='S' weight='medium' color={DESCRIPTION_TEXT_COLOR}>Risks associated with holding the underlying tokens are still present when depositing to this pool. Ethereum blockchain clients can break and bugs can be exploited. This interface may not always work.</Text>,
    image: TokenAndBaseLayerRiskIcon,
  },
];

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
      <RiskBody>
        <RiskInfo>
          {title}
          {description}
        </RiskInfo>
        <div className='flex items-center justify-between'>
          <NavigationButton disabled={isPreviousButtonDisabled} onClick={() => setCurrentCardIndex(currentCardIndex - 1)}>
            <img src={isPreviousButtonDisabled ? PreviousChevronInactive : PreviousChevronActive} alt='Previous' />
          </NavigationButton>
          <div className='flex items-center gap-x-2'>
            {RISK_CARDS.map((_riskCard, index) => (
              <NavigationDot className={index === currentCardIndex ? 'active' : ''} key={index} />
            ))}
          </div>
          <NavigationButton disabled={isNextButtonDisabled} onClick={() => {setCurrentCardIndex(currentCardIndex + 1)}}>
            <img src={isNextButtonDisabled ? NextChevronInactive : NextChevronActive} alt='Next' />
          </NavigationButton>
        </div>
      </RiskBody>
    </Wrapper>
  );
}
