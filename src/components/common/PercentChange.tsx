import React from 'react';
import { roundPercentage } from '../../util/Numbers';
import PositiveChangeIcon from '../../assets/svg/positive_change_chevron.svg';
import NegativeChangeIcon from '../../assets/svg/negative_change_chevron.svg';
import styled from 'styled-components';
import { Text } from './Typography';
import { ReactComponent as UpArrow } from '../../assets/svg/up_arrow.svg';
import { ReactComponent as DownArrow } from '../../assets/svg/down_arrow.svg';

const POSITIVE_PERCENT_BG_COLOR = 'rgba(0, 193, 67, 0.1)';
const POSITIVE_PERCENT_TEXT_COLOR = 'rgb(0, 193, 67)';
const NEGATIVE_PERCENT_BG_COLOR = 'rgba(255, 255, 255, 0.1)';
const NEGATIVE_PERCENT_TEXT_COLOR = 'rgba(130, 160, 182, 1)';
const PERCENT_ROUNDING_PRECISION = 2;

const PercentChangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  border-radius: 8px;
  padding: 6px;
  &:after {
    content: '';
    width: 14px;
    height: 14px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

export const PositivePercentChangeContainer = styled(PercentChangeContainer)`
  background: ${POSITIVE_PERCENT_BG_COLOR};
  &:after {
    background-image: url(${PositiveChangeIcon});
  }
`;

export const NegativePercentChangeContainer = styled(PercentChangeContainer)`
  background: ${NEGATIVE_PERCENT_BG_COLOR};
  &:after {
    background-image: url(${NegativeChangeIcon});
  }
`;

export type PercentChangeProps = {
  percent: number;
};

export function PercentChange(props: PercentChangeProps) {
  const { percent } = props;
  if (percent >= 0) {
    return (
      <PositivePercentChangeContainer>
        <Text size='XS' weight='bold' color={POSITIVE_PERCENT_TEXT_COLOR}>
          +{roundPercentage(percent, PERCENT_ROUNDING_PRECISION)}%
        </Text>
      </PositivePercentChangeContainer>
    );
  } else {
    return (
      <NegativePercentChangeContainer>
        <Text size='XS' weight='bold' color={NEGATIVE_PERCENT_TEXT_COLOR}>
          {roundPercentage(percent, PERCENT_ROUNDING_PRECISION)}%
        </Text>
      </NegativePercentChangeContainer>
    );
  }
}

const CombinedPercentChangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  border-radius: 8px;
  padding: 8px 10px;
`;

const PositiveCombinedPercentChangeContainer = styled(
  CombinedPercentChangeContainer
)`
  background: ${POSITIVE_PERCENT_BG_COLOR};
`;

const NegativeCombinedPercentChangeContainer = styled(
  CombinedPercentChangeContainer
)`
  background: ${NEGATIVE_PERCENT_BG_COLOR};
`;

export type CombinedPercentChangeProps = {
  value: number;
  percent: number;
};

export function CombinedPercentChange(props: CombinedPercentChangeProps) {
  const { value, percent } = props;
  if (percent >= 0) {
    return (
      <PositiveCombinedPercentChangeContainer>
        <UpArrow />
        <Text size='S' weight='medium' color={POSITIVE_PERCENT_TEXT_COLOR}>
          {value.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })} ({roundPercentage(percent, PERCENT_ROUNDING_PRECISION)}%)
        </Text>
      </PositiveCombinedPercentChangeContainer>
    );
  } else {
    return (
      <NegativeCombinedPercentChangeContainer>
        <DownArrow />
        <Text size='S' weight='medium' color={NEGATIVE_PERCENT_TEXT_COLOR}>
          {value} ({roundPercentage(percent, PERCENT_ROUNDING_PRECISION)}%)
        </Text>
      </NegativeCombinedPercentChangeContainer>
    );
  }
}
