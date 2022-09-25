import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { getColorForAnnotationType, getPoolAnnotation } from '../../data/BlendPoolAnnotations';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import { Text } from '../common/Typography';

const PoolAnnotationWrapper = styled.div.attrs(
  (props: { borderColor: string; }) => props
)`
  ${tw`my-2 p-2 rounded-xl grid`}
  grid-template-columns: 24px 1fr;
  grid-gap: 8px;
  align-items: center;
  border: 2px solid ${(props) => props.borderColor};
`;

export type PoolAnnotationProps = {
  poolData: BlendPoolMarkers;
};

export default function PoolAnnotation({ poolData }: PoolAnnotationProps) {
  const poolAnnotation = getPoolAnnotation(poolData.poolAddress);

  if (poolAnnotation == null) {
    return <></>;
  }

  const color = getColorForAnnotationType(poolAnnotation.type);

  return (
    <PoolAnnotationWrapper borderColor={color}>
      <poolAnnotation.Icon />
      <Text size='S' color={color}>
        {poolAnnotation.label}
      </Text>
    </PoolAnnotationWrapper>
  );
}
