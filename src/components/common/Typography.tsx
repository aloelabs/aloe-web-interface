import styled from 'styled-components';
import { RESPONSIVE_BREAKPOINT_SM } from '../../data/constants/Breakpoints';

const DEFAULT_COLOR = 'rgba(255, 255, 255, 1)';

const DISPLAY_FONT_SIZES = {
  XL: '48px',
  L: '32px',
  M: '24px',
  S: '20px',
  XS: '16px',
};

const DISPLAY_FONT_SIZES_MOBILE = {
  XL: '32px',
  L: '24px',
  M: '20px',
  S: '16px',
  XS: '14px',
};

const DISPLAY_FONT_WEIGHTS = {
  regular: '400',
  medium: '400',
  semibold: '600',
};

const DISPLAY_LINE_HEIGHTS = {
  XL: '60px',
  L: '40px',
  M: '32px',
  S: '24px',
  XS: '20px',
};

const TEXT_FONT_SIZES = {
  XL: '24px',
  L: '20px',
  M: '16px',
  S: '14px',
  XS: '12px',
};

const TEXT_FONT_SIZES_MOBILE = {
  XL: '20px',
  L: '16px',
  M: '14px',
  S: '12px',
  XS: '10px',
};

const TEXT_FONT_WEIGHTS = {
  regular: '400',
  medium: '400',
  bold: '700',
};

const TEXT_LINE_HEIGHTS = {
  XL: '32px',
  L: '30px',
  M: '24px',
  S: '20px',
  XS: '18px',
};

export const Display = styled.div.attrs(
  (props: {
    size: 'XL' | 'L' | 'M' | 'S' | 'XS';
    weight: 'regular' | 'medium' | 'semibold';
    color?: string;
  }) => props
)`
  font-family: 'ClashDisplay-Variable';
  font-size: ${(props) => DISPLAY_FONT_SIZES[props.size]};
  font-weight: ${(props) => DISPLAY_FONT_WEIGHTS[props.weight]};
  line-height: ${(props) => DISPLAY_LINE_HEIGHTS[props.size]};
  color: ${(props) => props.color || DEFAULT_COLOR};

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    font-size: ${(props) => DISPLAY_FONT_SIZES_MOBILE[props.size]};
  }
`;

export const Text = styled.div.attrs(
  (props: {
    size: 'XL' | 'L' | 'M' | 'S' | 'XS';
    weight: 'regular' | 'medium' | 'bold';
    color?: string;
  }) => props
)`
  font-family: 'Satoshi-Variable';
  font-size: ${(props) => TEXT_FONT_SIZES[props.size]};
  font-weight: ${(props) => TEXT_FONT_WEIGHTS[props.weight]};
  line-height: ${(props) => TEXT_LINE_HEIGHTS[props.size]};
  color: ${(props) => props.color || DEFAULT_COLOR};

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    font-size: ${(props) => TEXT_FONT_SIZES_MOBILE[props.size]};
  }
`;
