import React from "react";
import { getPoolAnnotation } from "../../data/BlendPoolAnnotations";
import { BlendPoolMarkers } from "../../data/BlendPoolMarkers";

export type PoolAnnotationProps = {
  poolData: BlendPoolMarkers;
}

export default function PoolAnnotation({poolData}: PoolAnnotationProps) {
  const poolAnnotation = getPoolAnnotation(poolData.poolAddress);

  if (poolAnnotation == null) {
    return <></>;
  }

  return (
    <div>
      {poolAnnotation.label}
    </div>
  );
}