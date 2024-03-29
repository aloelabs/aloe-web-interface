export type SiloData = {
  address: string;
  name?: string;
  shortName?: string;
  deprecated?: boolean;
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
      deprecated: true,
    },
  ],
  // Rari Fuse 8 FEI Silo
  [
    '0x0770d239e56d96bc1e049b94949b0a0199b77cf6',
    {
      address: '0x0770d239e56d96bc1e049b94949b0a0199b77cf6',
      name: 'Rari Fuse 8 FEI Silo',
      shortName: 'Rari Fuse 8',
      deprecated: true,
    },
  ],
  // Rari Fuse 8 TRIBE Incentivized Silo
  [
    '0x2a9855dc8afa59e6067287b8aa15cd009938d137',
    {
      address: '0x2a9855dc8afa59e6067287b8aa15cd009938d137',
      name: 'Rari Fuse 8 TRIBE Incentivized Silo',
      shortName: 'Rari Fuse 8',
      deprecated: true,
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
      deprecated: true,
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
  // Euler WETH ERC4626 Silo (old erc4626)
  [
    '0x922e36583eecd7acb7006aa3d2fa0fd1e4b0453e',
    {
      address: '0x922e36583eecd7acb7006aa3d2fa0fd1e4b0453e',
      name: 'ERC4626 Euler WETH Silo',
      shortName: 'Euler (ERC4626, old)',
      deprecated: true,
    },
  ],
  // Euler oSQTH ERC4626 Silo (old erc4626)
  [
    '0x7f48a8a5c5c079627eafffd1fe4c9cf80e741fe8',
    {
      address: '0x7f48a8a5c5c079627eafffd1fe4c9cf80e741fe8',
      name: 'ERC4626 Euler oSQTH Silo',
      shortName: 'Euler (ERC4626, old)',
      deprecated: true,
    },
  ],
  // Euler WETH ERC4626 Silo (new erc4626)
  [
    '0x09b5c1909e62052adf7fb82060ea2a98c3a5be45',
    {
      address: '0x09b5c1909e62052adf7fb82060ea2a98c3a5be45',
      name: 'ERC4626 Euler WETH Silo',
      shortName: 'Euler (ERC4626)',
    },
  ],
  // Euler oSQTH ERC4626 Silo (new erc4626)
  [
    '0xedee9503756aafdb50f6a7f6bfa3324cda453d47',
    {
      address: '0xedee9503756aafdb50f6a7f6bfa3324cda453d47',
      name: 'ERC4626 Euler oSQTH Silo',
      shortName: 'Euler (ERC4626)',
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
