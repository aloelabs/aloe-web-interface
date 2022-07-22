export function poolToUniswapV2Pair(address: string): string {
  switch (address) {
    case '0x33cb657e7fd57f1f2d5f392fb78d5fa80806d1b4':
      return '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc';
    case '0xe801c4175a0341e65dfef8f3b79e1889047afebb':
      return '0xbb2b8038a1640196fbe3e38816f3e67cba72d940';
    case '0x0b76abb170519c292da41404fdc30bb5bef308fc':
      return '0x9928e4046d7c6513326ccea028cd3e7a91c7590a';
    case '0x37dc6fcb5c03d46b097b094785c9fa557aa32fd4':
      return '0x8ae720a71622e824f576b4a8c03031066548a3b1';
    case '0x021016fbb4d3aaeaa440508c5e06ce8c1039fccd':
      return '0xdc00ba87cc2d99468f7f34bc04cbf72e111a32f7';
    default:
      return '';
  }
}
