import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { Text } from '../common/Typography';

const WHITE = '#FFFFFF';
const GRAPH_BUTTON_ACTIVE_BG_COLOR = '#0d171e';
const GRAPH_BUTTON_TEXT_COLOR = '#3f5464'; //rgba(43, 64, 80, 1);

export function buttonIdxToText(idx: number): string {
  switch (idx) {
    case 0:
      return '1D';
    case 1:
      return '1W';
    case 2:
      return '1M';
    case 3:
      return '3M';
    case 4:
      return '1Y';
    default:
      return 'ALL';
  }
}




const StyledGraphButton = styled.button.attrs(
  (props: { buttonWidth: number }) => props
)`
  ${tw`rounded-md p-1 bg-transparent disabled:text-grey-500`}
  width: ${(props) => props.buttonWidth}px;
  height: 36px;
  color: ${GRAPH_BUTTON_TEXT_COLOR};
  &.active {
    background-color: ${GRAPH_BUTTON_ACTIVE_BG_COLOR};
    color: ${WHITE};

    /* For the nested Text component */
    div {
      color: ${WHITE};
    }
  }
  &:hover {
    background-color: ${GRAPH_BUTTON_ACTIVE_BG_COLOR};
    color: ${WHITE};

    /* For the nested Text component */
    div {
      color: ${WHITE};
    }
  }
`;

const GraphButtonsContainer = styled.div`
  ${tw`flex gap-3`}
  padding: 4px 8px;
`

export type GraphButtonProps = {
  idx: number;
  text: string;
  active: boolean;
  width: number;
  handleClick: any;
};

const GraphButton = (props: GraphButtonProps) => {
  return (
    <StyledGraphButton
      key={props.idx}
      className={props.active ? 'active' : ''}
      onClick={props.handleClick}
      buttonWidth={props.width}
    >
      <Text size='S' weight='medium' color={GRAPH_BUTTON_TEXT_COLOR}>
        {props.text}
      </Text>
    </StyledGraphButton>
  );
};

export type GraphButtonsProps = {
  activeButton: number;
  handleClick: (key: number) => void;
};

export default function GraphButtons(props: GraphButtonsProps) {
  const { activeButton, handleClick } = props;

  const graphButtons: GraphButtonProps[] = [
    {
      idx: 0,
      text: buttonIdxToText(0),
      active: true,
      width: 40,
      handleClick: () => handleClick(0),
    },
    {
      idx: 1,
      text: buttonIdxToText(1),
      active: false,
      width: 44,
      handleClick: () => handleClick(1),
    },
    {
      idx: 2,
      text: buttonIdxToText(2),
      active: false,
      width: 42,
      handleClick: () => handleClick(2),
    },
    {
      idx: 3,
      text: buttonIdxToText(3),
      active: false,
      width: 45,
      handleClick: () => handleClick(3),
    },
    {
      idx: 4,
      text: buttonIdxToText(4),
      active: false,
      width: 38,
      handleClick: () => handleClick(4),
    },
    {
      idx: 5,
      text: buttonIdxToText(5),
      active: false,
      width: 49,
      handleClick: () => handleClick(5),
    },
  ];

  return (
    <GraphButtonsContainer>
      {graphButtons.map((props) => {
        props.active = props.idx === activeButton;
        return GraphButton(props);
      })}
    </GraphButtonsContainer>
  );
}
