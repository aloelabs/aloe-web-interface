import { BLOCKS_TO_WAIT, GAS_ESTIMATION_SCALING } from '../data/constants/Values';
import { BigNumber, Contract, ContractReceipt, Signer } from 'ethers';

import BlendPoolAbi from '../assets/abis/AloeBlend.json';
import Big from 'big.js';
import { BlendPoolStats } from '../data/BlendPoolDataResolver';

export async function withdraw(
  signer: Signer,
  poolAddress: string,
  shares: Big,
  ratioChange: number,
  poolStats: BlendPoolStats,
  completionCallback: (receipt?: ContractReceipt) => void
): Promise<void> {
  const tokenContract = new Contract(poolAddress, BlendPoolAbi, signer);

  const estimated0 = poolStats.inventory0.total
    .mul(shares)
    .div(poolStats.outstandingShares);
  const estimated1 = poolStats.inventory1.total
    .mul(shares)
    .div(poolStats.outstandingShares);

  const amount0Min = estimated0.mul(1 - ratioChange / 100);
  const amount1Min = estimated1.mul(1 - ratioChange / 100);

  let transactionOptions: any = {};

  try {
    const estimatedGas = (
      (await tokenContract.estimateGas.withdraw(
        shares.toFixed(0),
        amount0Min.toFixed(0),
        amount1Min.toFixed(0)
      )) as BigNumber
    ).toNumber();

    transactionOptions['gasLimit'] = (estimatedGas * GAS_ESTIMATION_SCALING).toFixed(0);
  } catch (e) {
    console.error('Error while estimating gas');
    console.error(e);
  }

  try {
    const transactionResponse = await tokenContract.withdraw(
      shares.toFixed(0),
      amount0Min.toFixed(0),
      amount1Min.toFixed(0),
      transactionOptions
    );
    const receipt = await transactionResponse.wait(BLOCKS_TO_WAIT);
    completionCallback(receipt);
  } catch (e) {
    // User probably rejected in MetaMask or wallet
    console.error(e);
    completionCallback();
  }
}
