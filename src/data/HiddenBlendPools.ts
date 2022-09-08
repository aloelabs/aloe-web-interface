const HiddenBlendPools: Set<string> = new Set([]);

export function isHiddenPool(poolAddress: string) : boolean {
  return HiddenBlendPools.has(poolAddress);
}
