import { BLOCKS_TO_WAIT, GAS_ESTIMATION_SCALING, UINT256_MAX } from '../data/constants/Values';
import { BigNumber, Contract, ContractReceipt, ethers, Signer } from 'ethers';

import WethAbi from '../assets/abis/Weth9.json';
import Erc20Abi from '../assets/abis/ERC20.json';
import BlendPoolAbi from '../assets/abis/AloeBlend.json';
import Big from 'big.js';
import { WETH_9_MAINNET_ADDRESS } from '../data/constants/Addresses';

export async function approve(
  signer: Signer,
  tokenAddress: string,
  poolAddress: string,
  completionCallback: (receipt?: ContractReceipt) => void,
  amount: string = UINT256_MAX
): Promise<void> {
  const tokenContract = new Contract(tokenAddress, Erc20Abi, signer);

  try {
    const transactionResponse = await tokenContract.approve(
      poolAddress,
      amount
    );
    const receipt = await transactionResponse.wait(BLOCKS_TO_WAIT);
    completionCallback(receipt);
  } catch (e) {
    // User probably rejected in MetaMask or wallet
    console.error(e);
    completionCallback();
  }
}

export async function mintWeth(
  signer: Signer,
  amount: Big,
  completionCallback: (receipt?: ContractReceipt) => void
): Promise<void> {
  const wethContract = new Contract(WETH_9_MAINNET_ADDRESS, WethAbi, signer);

  try {
    const transactionResponse = await wethContract.deposit({
      value: ethers.BigNumber.from(amount.toFixed(0)),
    });
    const receipt = await transactionResponse.wait(BLOCKS_TO_WAIT);
    completionCallback(receipt);
  } catch (e) {
    // User probably rejected in MetaMask or wallet
    console.error(e);
    completionCallback();
  }
}

export async function deposit(
  signer: Signer,
  poolAddress: string,
  amount0Max: Big,
  amount1Max: Big,
  ratioChange: number,
  completionCallback: (receipt?: ContractReceipt) => void
): Promise<void> {
  const blendContract = new Contract(poolAddress, BlendPoolAbi, signer);
  const amount0Min = amount0Max.mul(1 - ratioChange / 100);
  const amount1Min = amount1Max.mul(1 - ratioChange / 100);

  let transactionOptions: any = {};
  try {
    const estimatedGas = (
      (await blendContract.estimateGas.deposit(
        amount0Max.toFixed(0),
        amount1Max.toFixed(0),
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
    const transactionResponse = await blendContract.deposit(
      amount0Max.toFixed(0),
      amount1Max.toFixed(0),
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
