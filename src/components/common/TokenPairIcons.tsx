import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import UnknownTokenIcon from '../../assets/svg/tokens/unknown_token.svg';

const DEFAULT_TOKEN_BACKGROUND_COLOR = 'rgba(255, 255, 255, 1)';
const OMIT_TOKEN_BACKGROUND_COLOR = 'transparent';
const DEFAULT_TOKEN_BORDER_COLOR = 'rgba(0, 0, 0, 1)';

const TokenIconsWrapper = styled.div`
  ${tw`flex flex-row items-center justify-start -space-x-2`}
  width: 56px;
  height: 32px;
`;

const TokenIcon = styled.img.attrs(
  (props: { backgroundColor: string; borderColor: string }) => props
)`
  ${tw`w-8 h-8 rounded-full bg-white`}
  background-color: ${(props) => props.backgroundColor};
  box-shadow: 0 0 0 3px ${(props) => props.borderColor};
`;

export type TokenPairIconsProps = {
  token0IconPath: string | undefined;
  token1IconPath: string | undefined;
  token0AltText?: string;
  token1AltText?: string;
  iconBorderColor?: string;
  omitBackground?: boolean;
};

export default function TokenPairIcons(props: TokenPairIconsProps) {
  const {
    token0IconPath,
    token1IconPath,
    iconBorderColor,
    token0AltText,
    token1AltText,
    omitBackground,
  } = props;
  return (
    <TokenIconsWrapper>
      <TokenIcon
        src={token0IconPath || UnknownTokenIcon}
        backgroundColor={
          omitBackground
            ? OMIT_TOKEN_BACKGROUND_COLOR
            : DEFAULT_TOKEN_BACKGROUND_COLOR
        }
        borderColor={iconBorderColor || DEFAULT_TOKEN_BORDER_COLOR}
        alt={token0AltText}
      />
      <TokenIcon
        src={token1IconPath || UnknownTokenIcon}
        backgroundColor={
          omitBackground
            ? OMIT_TOKEN_BACKGROUND_COLOR
            : DEFAULT_TOKEN_BACKGROUND_COLOR
        }
        borderColor={iconBorderColor || DEFAULT_TOKEN_BORDER_COLOR}
        alt={token1AltText}
      />
    </TokenIconsWrapper>
  );
}
