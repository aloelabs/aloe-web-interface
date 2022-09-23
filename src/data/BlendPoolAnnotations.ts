export enum AnnotationType {
  DEPRECATED,
}

export type BlendPoolAnnotation = {
  label: string;
  type: AnnotationType;
}

const BlendPoolAnnotations: Map<string, BlendPoolAnnotation> = new Map(
  [
    ["0x0b76abb170519c292da41404fdc30bb5bef308fc", { // Fei-Tribe 0.05 Pool - Fuse 8. Fuse 8
      label: "Do not use this Blend pool. Rari Fuse has been deprecated.",
      type: AnnotationType.DEPRECATED,
    }],
    ["0x37dc6fcb5c03d46b097b094785c9fa557aa32fd4", {// Rai-Eth 0.3 Pool - Fuse 9, Yearn
      label: "Do not use this Blend pool. Rari Fuse has been deprecated.",
      type: AnnotationType.DEPRECATED,
    }],
  ]
);

export function getPoolAnnotation(address: string): BlendPoolAnnotation | null {
  return BlendPoolAnnotations.get(address) || null;
}
