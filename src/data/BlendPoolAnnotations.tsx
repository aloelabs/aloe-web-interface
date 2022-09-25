import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import { ReactComponent as WarningIcon } from '../assets/svg/warning.svg';

const WARNING_COLOR = 'rgba(242, 201, 76, 1)';

export enum AnnotationType {
  DEPRECATED,
}

export type BlendPoolAnnotation = {
  Icon: React.FC;
  label: ReactNode;
  type: AnnotationType;
};

const StyledWarningIcon = styled(WarningIcon)`
  ${tw`inline`}
  width: 24px;
  height: 24px;
  margin-right: 6px;
  path {
    fill: ${WARNING_COLOR};
  }
`;

const BlendPoolAnnotations: Map<string, BlendPoolAnnotation> = new Map([
  [
    '0x0b76abb170519c292da41404fdc30bb5bef308fc',
    {
      // Fei-Tribe 0.05 Pool - Fuse 8. Fuse 8
      Icon: () => <StyledWarningIcon />,
      label: <>Do not use this Blend pool. Rari Fuse has been deprecated.</>,
      type: AnnotationType.DEPRECATED,
    },
  ],
  [
    '0x37dc6fcb5c03d46b097b094785c9fa557aa32fd4',
    {
      // Rai-Eth 0.3 Pool - Fuse 9, Yearn
      Icon: () => <StyledWarningIcon />,
      label: <>Do not use this Blend pool. Rari Fuse has been deprecated.</>,
      type: AnnotationType.DEPRECATED,
    },
  ],
  [
    '0xd41e2eb322a183c5bfed9cebfdb7bd0dfcfc040f',
    {
      // Eth-oSqth 0.3 Pool - Euler, Euler (old)
      Icon: () => <StyledWarningIcon />,
      label: (
        <>
          This pool may exhibit unexpected behavior when borrow utilization is
          high on Euler. To better support partial withdrawals and avoid further
          issues with the graphs, an updated version was deployed. Please
          withdraw and migrate to the&nbsp;
          <Link
            to={'/blend/pool/0xe53555fdbe3b38455671794b2280b7fa357c6b48'}
            className={'text-white underline underline-offset-2'}
          >
            new pool
          </Link>
          .
        </>
      ),
      type: AnnotationType.DEPRECATED,
    },
  ],
]);

export function getPoolAnnotation(address: string): BlendPoolAnnotation | null {
  return BlendPoolAnnotations.get(address) || null;
}

export function getColorForAnnotationType(
  annotationType: AnnotationType
): string {
  switch (annotationType) {
    case AnnotationType.DEPRECATED:
    default:
      return WARNING_COLOR;
  }
}
