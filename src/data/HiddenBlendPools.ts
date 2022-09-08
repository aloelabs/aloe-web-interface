const HiddenBlendPools: string[] = [];

const HiddenBlendPoolsSet: Set<string> = new Set();

HiddenBlendPools.forEach((poolAddress: string) => {
  HiddenBlendPoolsSet.add(poolAddress);
});

export function isHiddenPool(poolAddress: string) : boolean {
  return HiddenBlendPoolsSet.has(poolAddress);
}
