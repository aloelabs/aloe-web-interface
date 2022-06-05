import React from 'react';
import { roundPercentage } from '../../util/Numbers';
import PositiveChangeIcon from '../../assets/svg/positive_change_chevron.svg';
import NegativeChangeIcon from '../../assets/svg/negative_change_chevron.svg';
import styled from 'styled-components';

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
  font-size: 12px;
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
  color: ${POSITIVE_PERCENT_TEXT_COLOR};
  &:after {
    background-image: url(${PositiveChangeIcon});
  }
`;

export const NegativePercentChangeContainer = styled(PercentChangeContainer)`
  background: ${NEGATIVE_PERCENT_BG_COLOR};
  color: ${NEGATIVE_PERCENT_TEXT_COLOR};
  &:after {
    background-image: url(${NegativeChangeIcon});
  }
`;

export type PercentChangeProps = {
  percent: number;
};

export default function PercentChange(props: PercentChangeProps) {
  const { percent } = props;
  if (percent >= 0) {
    return (
      <PositivePercentChangeContainer>
        +{roundPercentage(percent, PERCENT_ROUNDING_PRECISION)}%
      </PositivePercentChangeContainer>
    );
  } else {
    return (
      <NegativePercentChangeContainer>
        {roundPercentage(percent, PERCENT_ROUNDING_PRECISION)}%
      </NegativePercentChangeContainer>
    );
  }
}
