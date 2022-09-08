const HiddenBlendPools = [
  "0x0b76abb170519c292da41404fdc30bb5bef308fc"
];

const HiddenBlendPoolsMap: Map<string, boolean> = new Map();

HiddenBlendPools.forEach((poolAddress: string) => {
  HiddenBlendPoolsMap.set(poolAddress, true);
});

export function isHiddenPool(poolAddress: string) : boolean {
  return HiddenBlendPoolsMap.has(poolAddress);
}
