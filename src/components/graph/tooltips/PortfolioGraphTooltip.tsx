import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { format, parseISO } from 'date-fns';
import { Text } from '../../common/Typography';

const TOOLTIP_BG_COLOR = 'rgba(255, 255, 255, 0.1)';
const TOOLTIP_BORDER_COLOR = 'rgba(255, 255, 255, 0.1)';
const TOOLTIP_TEXT_COLOR = 'rgba(130, 160, 182, 1)';

const prettify = (value: number) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const TooltipContainer = styled.div`
  ${tw`rounded-md shadow-md`}
  background: ${TOOLTIP_BG_COLOR};
  border: 1px solid ${TOOLTIP_BORDER_COLOR};
  min-width: 206px;
  box-shadow: 0px 8px 32px 0px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(24px);
`;

const TooltipTitleContainer = styled.div`
  ${tw`flex flex-row justify-between align-middle px-4 py-3`}
  border-bottom: 1px solid ${TOOLTIP_BORDER_COLOR};
`;

export default function PortfolioGraphTooltip(data: any, active = false) {
  if (active) {
    const payload = data.payload;
    const label = data.label;
    const labelTop = label ? format(parseISO(label), 'MMM dd, yyyy') : '';
    const labelBottom = label ? format(parseISO(label), 'hh:mm a') : '';

    const tooltipValues = payload.map((item: any, index: number) => {
      return (
        <div className='flex flex-col justify-center items-center' key={index}>
          <Text size='S' weight='medium' color={item.color}>
            {item.name}
          </Text>
          <Text size='L' weight='bold' color={item.color}>
            {prettify(item.value)} USD
          </Text>
        </div>
      );
    });

    return (
      <TooltipContainer>
        <TooltipTitleContainer>
          <Text size='XS' weight='medium' color={TOOLTIP_TEXT_COLOR}>
            {labelTop}
          </Text>
          <Text size='XS' weight='medium' color={TOOLTIP_TEXT_COLOR}>
            {labelBottom}
          </Text>
        </TooltipTitleContainer>
        <div className='flex flex-col justify-between gap-2 mt-4 pl-3 pr-3 pb-3'>
          {tooltipValues}
        </div>
      </TooltipContainer>
    );
  }
  return null;
}
