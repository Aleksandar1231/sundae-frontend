
import { ChainId } from '@traderjoe-xyz/sdk';
import { Symbol } from './types';

export type Configuration = {
  name: string,
  chainId: ChainId;
  tokens: { [contractName: string]: { address: string, decimals: number } };
  koc: { [contractName: string]: string };
};

const configurations: { [env: string]: Configuration } = {
  production: {
    name: 'production',
    chainId: ChainId.AVALANCHE,
    tokens: {
      AVAX: { address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', decimals: 18 },
      WAVAX: { address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', decimals: 18 },
      USDC: { address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', decimals: 6 },
      kocUSDC: { address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', decimals: 6 },
      GRAPE: { address: "0x5541D83EFaD1f281571B343977648B75d95cdAC2", decimals: 18 },
      FUDGE: { address: "0xD9FF12172803c072a36785DeFea1Aa981A6A0C18", decimals: 18 },
      STRAW: { address: "0xf8D0C6c3ddC03F43A0687847f2b34bfd6941C2A2", decimals: 18 },


    },
    koc: {
      AVAX: "0x07d650EeFf4424B7C72359b4B89CeE0a0e0eD099",
      USDC: "0x044430507904d9B05eE7C6eE1fC7C739950F55D1",
      GRAPE: "0x533b61CA482Ed8521022dCC32666151300236E5b",
      FUDGE: "0x49B448384577223Be661222751f4152f651B0B85",
      STRAW: "0xA68702deaA3Ac004D74B4C42274B747d5C39fb04",
    },
  },
};


export default configurations['production'];
