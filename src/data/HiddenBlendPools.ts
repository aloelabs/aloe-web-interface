const HiddenBlendPools: string[] = [];

const HiddenBlendPoolsMap: Map<string, boolean> = new Map();

HiddenBlendPools.forEach((poolAddress: string) => {
  HiddenBlendPoolsMap.set(poolAddress, true);
});

export function isHiddenPool(poolAddress: string) : boolean {
  return HiddenBlendPoolsMap.has(poolAddress);
}
