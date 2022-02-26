export type SiloData = {
  address: string;
  name?: string;
  shortName?: string;
};

const SiloDataMap = new Map<string, SiloData>([
  // Compound USDC Silo
  [
    '0x723bfe564661536fdffa3e9e060135928d3bf18f',
    {
      address: '0x723bfe564661536fdffa3e9e060135928d3bf18f',
      name: 'Compound USDC Silo',
      shortName: 'Compound',
    },
  ],
  // Compound WETH Silo
  [
    '0x0a230cca01f7107933d5355913e9a65082f37c52',
    {
      address: '0x0a230cca01f7107933d5355913e9a65082f37c52',
      name: 'Compound WETH Silo',
      shortName: 'Compound',
    },
  ],
  // Rari Fuse 8 WETH Silo
  [
    '0xba9ad27ed23b5e002e831514e69554815a5820b3',
    {
      address: '0xba9ad27ed23b5e002e831514e69554815a5820b3',
      name: 'Rari Fuse 8 WETH Silo',
      shortName: 'Rari Fuse 8',
    },
  ],
  // Rari Fuse 8 FEI Silo
  [
    '0x0770d239e56d96bc1e049b94949b0a0199b77cf6',
    {
      address: '0x0770d239e56d96bc1e049b94949b0a0199b77cf6',
      name: 'Rari Fuse 8 FEI Silo',
      shortName: 'Rari Fuse 8',
    },
  ],
  // Rari Fuse 8 TRIBE Incentivized Silo
  [
    '0x2a9855dc8afa59e6067287b8aa15cd009938d137',
    {
      address: '0x2a9855dc8afa59e6067287b8aa15cd009938d137',
      name: 'Rari Fuse 8 TRIBE Incentivized Silo',
      shortName: 'Rari Fuse 8',
    },
  ],
  // WBTC yVault Silo
  [
    '0xda2d30c659cfeb176053b22be11fc351e077fdc0',
    {
      address: '0xda2d30c659cfeb176053b22be11fc351e077fdc0',
      name: 'WBTC Yearn Vault Silo',
      shortName: 'Yearn',
    },
  ],
  // WETH yVault Silo
  [
    '0x8f43969d04ba8aaec7c69813a07a276189c574d2',
    {
      address: '0x8f43969d04ba8aaec7c69813a07a276189c574d2',
      name: 'WETH Yearn Vault Silo',
      shortName: 'Yearn',
    },
  ],
  // Rari Fuse 9 RAI Silo
  [
    '0xf70fc6b694d911b1f665b754f77ec5e83d340594',
    {
      address: '0xf70fc6b694d911b1f665b754f77ec5e83d340594',
      name: 'Rari Fuse 9 RAI Silo',
      shortName: 'Rari Fuse 9',
    },
  ],
  // LooksRare Silo
  [
    '0x7a17db19e5bfe3e96d6a8da9c100ac86a4650d54',
    {
      address: '0x7a17db19e5bfe3e96d6a8da9c100ac86a4650d54',
      name: 'LooksRare Staking LOOKS Silo',
      shortName: 'LOOKS Staking',
    },
  ],
]);

export function GetSiloData(address: string): SiloData {
  if (SiloDataMap.has(address)) {
    return SiloDataMap.get(address)!;
  } else
    return {
      address,
    };
}
