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
    <div className="my-2 p-2 rounded-xl border-2 border-caution">
      <span className="text-caution">{poolAnnotation.label}</span>
    </div>
  );
}
