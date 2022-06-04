import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { format, parseISO } from 'date-fns';

const TOOLTIP_BG_COLOR = 'rgba(0, 0, 0, 0.4)';
const TOOLTIP_BORDER_COLOR = 'rgba(255, 255, 255, 0.1)';
const TOOLTIP_TEXT_COLOR = 'rgba(130, 160, 182, 1)';

const prettify = (value: number) => {
  let result = value ? value.toFixed(2) : '0';
  return result + '%';
};

const TooltipContainer = styled.div`
  ${tw`rounded-md shadow-md`}
  background: ${TOOLTIP_BG_COLOR};
  border: 1px solid ${TOOLTIP_BORDER_COLOR};
`;

const TooltipTitleContainer = styled.div`
  ${tw`flex flex-col justify-center align-middle pt-3 pl-3 pr-3 pb-1`}
  border-bottom: 1px solid ${TOOLTIP_BORDER_COLOR};
`;

const TooltipTitleText = styled.div`
  ${tw`text-xs font-medium`}
  color: ${TOOLTIP_TEXT_COLOR};
`;

const TooltipValue = styled.span`
  ${tw`text-sm font-bold`}
  color: ${(props) => props.color};
`;

const TooltipLabel = styled.span`
  ${tw`text-xs font-medium`}
  color: ${(props) => props.color};
`;

export default function BlendGraphTooltip(data: any, active = false) {
  if (active) {
    const payload = data.payload;
    const label = data.label;
    const labelTop = label ? format(parseISO(label), 'MMM dd, yyyy') : '';
    const labelBottom = label ? format(parseISO(label), 'hh:mm a') : '';

    const tooltipValues = payload.map((item: any, index: number) => {
      return (
        <div className='flex flex-col' key={index}>
          <TooltipLabel color={item.color}>{item.name}</TooltipLabel>
          <TooltipValue color={item.color}>{prettify(item.value)}</TooltipValue>
        </div>
      );
    });

    return (
      <TooltipContainer>
        <TooltipTitleContainer>
          <TooltipTitleText>{labelTop}</TooltipTitleText>
          <TooltipTitleText>{labelBottom}</TooltipTitleText>
        </TooltipTitleContainer>
        <div className='flex flex-col justify-between gap-2 mt-1 pl-3 pr-3 pb-3'>
          {tooltipValues}
        </div>
      </TooltipContainer>
    );
  }
  return null;
}
