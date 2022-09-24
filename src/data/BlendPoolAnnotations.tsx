import { ReactNode } from "react";
import { Link } from "react-router-dom";

export enum AnnotationType {
  DEPRECATED,
}

export type BlendPoolAnnotation = {
  label: ReactNode;
  type: AnnotationType;
}

const BlendPoolAnnotations: Map<string, BlendPoolAnnotation> = new Map(
  [
    ["0x0b76abb170519c292da41404fdc30bb5bef308fc", { // Fei-Tribe 0.05 Pool - Fuse 8. Fuse 8
      label: <>Do not use this Blend pool. Rari Fuse has been deprecated.</>,
      type: AnnotationType.DEPRECATED,
    }],
    ["0x37dc6fcb5c03d46b097b094785c9fa557aa32fd4", { // Rai-Eth 0.3 Pool - Fuse 9, Yearn
      label: <>Do not use this Blend pool. Rari Fuse has been deprecated.</>,
      type: AnnotationType.DEPRECATED,
    }],
    ["0xd41e2eb322a183c5bfed9cebfdb7bd0dfcfc040f", { // Eth-oSqth 0.3 Pool - Euler, Euler (old)
      label: <>
      This pool may exhibit unexpected behavior when borrow utilization is high on Euler. To better support partial withdrawals and avoid further issues with the graphs, an updated version was deployed. Please withdraw and migrate to the&nbsp; 
      <Link to={"/blend/pool/0xe53555fdbe3b38455671794b2280b7fa357c6b48"} className={"text-white underline underline-offset-2"}>new pool</Link>.
      </>,
      type: AnnotationType.DEPRECATED,
    }],
  ]
);

export function getPoolAnnotation(address: string): BlendPoolAnnotation | null {
  return BlendPoolAnnotations.get(address) || null;
}
