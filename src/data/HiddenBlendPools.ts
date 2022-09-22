const HiddenBlendPools: Set<string> = new Set([
  // "0x0b76abb170519c292da41404fdc30bb5bef308fc", // Fei-Tribe 0.05 Pool - Fuse 8. Fuse 8
  // "0x37dc6fcb5c03d46b097b094785c9fa557aa32fd4", // Rae-Eth 0.3 Pool - Fuse 9, Yearn
]);

export function isHiddenPool(poolAddress: string) : boolean {
  return HiddenBlendPools.has(poolAddress);
}
