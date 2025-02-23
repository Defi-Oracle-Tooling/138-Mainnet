import { Contract } from 'ethers';
import { MULTICALL_ABI } from '../constants/abis';

export class MultiCallService {
  private multicall: Contract;

  constructor(provider: any) {
    this.multicall = new Contract(
      process.env.NEXT_PUBLIC_MULTICALL_ADDRESS!,
      MULTICALL_ABI,
      provider
    );
  }

  async aggregate(calls: Array<{ target: string; callData: string }>) {
    const { returnData } = await this.multicall.aggregate(calls);
    return returnData;
  }

  async getBlockMetrics() {
    const calls = [
      { target: this.multicall.address, callData: 'getBlockNumber()' },
      { target: this.multicall.address, callData: 'getCurrentBlockGasLimit()' },
      // Add more metrics
    ];
    return this.aggregate(calls);
  }
}
