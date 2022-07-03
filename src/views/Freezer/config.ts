// import { ChainId } from '@pancakeswap-libs/sdk';
import { ChainId } from '@traderjoe-xyz/sdk';
import ERC20 from './ethereum/ERC20/ERC20';
import { Symbol } from './types';

export type Configuration = {
  name: string,
  chainId: ChainId;
  tokens: { [contractName: string]: { address: string, decimals: number } };
  contracts: { [contractName: string]: string };
  koc: { [contractName: string]: string };
  genesisPools: { [contractName: string]: string };
};

const configurations: { [env: string]: Configuration } = {
  development: {
    name: 'development',
    chainId: ChainId.FUJI,
    tokens: {
      kocUSDC: { address: '0x3f8896C313B276D412856Ff67bb2842FBb8Ac134', decimals: 18 },
      AVAX: { address: "0x1CdD6210897913CFE9748f7687C270454a89ed0d", decimals: 18 },
      WAVAX: { address: "0x1CdD6210897913CFE9748f7687C270454a89ed0d", decimals: 18 },
      USDC: { address: "0x24ebD67431990f1191860B8f5Cc901e2de8D8c68", decimals: 18 },
      STOMB: { address: "0x9e6832D13b29d0B1C1c3465242681039b31C7a05", decimals: 18 },
      SLOT: { address: "0x924157B5dbB387A823719916B25256410a4Ad470", decimals: 18 },
      GRAVE: { address: "0x3700a92dd231F0CaC37D31dBcF4c0f5cCb1db6Ca", decimals: 18 },
      GSHARE: { address: "0xFfE04Bf98C7111360Bf7A6c56b343915543cD941", decimals: 18 },
      ZOMBIE: { address: "0x431bDC9975D570da5eD69C4E97e27114BCd55a86", decimals: 18 },
      ZSHARE: { address: "0xF05e236A139CB19851cD5568A85094D6EE331fAc", decimals: 18 },
      WLRS: { address: "0x395908aeb53d33A9B8ac35e148E9805D34A555D3", decimals: 18 },
      WSHARE: { address: "0xe6d1aFea0B76C8f51024683DD27FA446dDAF34B6", decimals: 18 },
      GRAPE: { address: "0x5541D83EFaD1f281571B343977648B75d95cdAC2", decimals: 18 },
      WINE: { address: "0xC55036B5348CfB45a932481744645985010d3A44", decimals: 18 },
      GLAD: { address: "0x482C46f9bCb7B122aA9575aEaECdd810981De9eb", decimals: 18 },
      "GLAD-AVAX LP": { address: "0xA091CeA4929aE269699686DbADc4119228727F70", decimals: 18 },
      "GLADSHARE-AVAX LP": { address: "0xC7AeA8def85EfFBa5667f3973eF850452E405ED8", decimals: 18 },
      SIFU: { address: "0x2Dd8F9780c808965880BDAd03Ec5F62e9b389496", decimals: 18 },
      ASTRO: { address: "0x6d2f5dBf3a7396FCe32CfE406Aef7a8AFF812Fbb", decimals: 18 },
      GAME: { address: "0x6d2f5dBf3a7396FCe32CfE406Aef7a8AFF812Fbb", decimals: 18 },
    },
    contracts: {
      whiteList: "0x231635eF473476fF9ED6Ac4543C4cE6590636293",
    },
    koc: {
      AVAX: "0xe577F30CccB54F74Bce4ae7628338B261d8DbD6F",
      USDC: "0xD028d47Cb08CEe202FcbD5dE59d4F6A206Fff5c7",
      STOMB: "0x7CDc390c552A58Bf6FF170c11579b8c39657b762",
      SLOT: "0x7d3ACe9F0269fDf37322807455E1b9c517f99487",
      GRAVE: "0x64B5818eC43A144aA3b356ae6F095aF54cfD10f4",
      GSHARE: "0xDC04D4d628f6E9Cfd58495B5fB56c15Aa5cDE9Ba",
      ZOMBIE: "0xb102cb2f270a2C029AEaF4C141e1e27A99FF3b50",
      ZSHARE: "0x86b31B626E9DAB557C0AF203A81CbDbD18F8C882",
      WLRS: "0xDB65aB11D8820C1dF85215D1D6dbEE22f3c973DD",
      WSHARE: "0x7ef1F9ADe3653eab169F283A45CCA7095Fc2113e",
      GRAPE: "0x9559b6887EF139B9f7b84c70aEc1Bea2Be2a8b8f",
      WINE: "0x02Bd8B43Ed266dbA71D7EF2A31895f353C60B588",
      GLAD: "",
      GLADSHARE: "",
      ASTRO: "0xa2a36D2995D9f64Ac2dC7C6B371663751416130A",
      GAME: "0xa2a36D2995D9f64Ac2dC7C6B371663751416130A",
    },
    genesisPools: {
      whiteList: "0xDa75fBDf64b3cF15Ba8f2925dC8e202E39c3657B",
      genesisPool: "0xFd1242B496CDAf8F2F116e598c27aC32F1EcAaf8",
      genesisPoolWl: "0x811a28760B25241cBc1fC34c19af3D3A26EeE05b",
    },
  },
  production: {
    name: 'production',
    chainId: ChainId.AVALANCHE,
    tokens: {
      AVAX: { address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', decimals: 18 },
      WAVAX: { address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', decimals: 18 },
      USDC: { address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', decimals: 6 },
      kocUSDC: { address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', decimals: 6 },
      STOMB: { address: "0x9e6832D13b29d0B1C1c3465242681039b31C7a05", decimals: 18 },
      SLOT: { address: "0x924157B5dbB387A823719916B25256410a4Ad470", decimals: 18 },
      GRAVE: { address: "0x3700a92dd231F0CaC37D31dBcF4c0f5cCb1db6Ca", decimals: 18 },
      GSHARE: { address: "0xFfE04Bf98C7111360Bf7A6c56b343915543cD941", decimals: 18 },
      ZOMBIE: { address: "0x431bDC9975D570da5eD69C4E97e27114BCd55a86", decimals: 18 },
      ZSHARE: { address: "0xF05e236A139CB19851cD5568A85094D6EE331fAc", decimals: 18 },
      WLRS: { address: "0x395908aeb53d33A9B8ac35e148E9805D34A555D3", decimals: 18 },
      WSHARE: { address: "0xe6d1aFea0B76C8f51024683DD27FA446dDAF34B6", decimals: 18 },
      GRAPE: { address: "0x5541D83EFaD1f281571B343977648B75d95cdAC2", decimals: 18 },
      WINE: { address: "0xC55036B5348CfB45a932481744645985010d3A44", decimals: 18 },
      GLAD: { address: "", decimals: 18 },
      "GLAD-AVAX LP": { address: "", decimals: 18 },
      "GLADSHARE-AVAX LP": { address: "", decimals: 18 },
      SIFU: { address: "", decimals: 18 },
      ASTRO: { address: "0x6d2f5dBf3a7396FCe32CfE406Aef7a8AFF812Fbb", decimals: 18 },
      GAME: { address: "0x55915FD5433193a082434A280e7A460A3d529d2f", decimals: 18 },
    },
    contracts: {
      whiteList: "0xB7deD448A165A8117bCf4899c4CFb4a255C0F69b",
    },
    koc: {
      AVAX: "0x07d650EeFf4424B7C72359b4B89CeE0a0e0eD099",
      USDC: "0x044430507904d9B05eE7C6eE1fC7C739950F55D1",
      STOMB: "0x7CDc390c552A58Bf6FF170c11579b8c39657b762",
      SLOT: "0x7d3ACe9F0269fDf37322807455E1b9c517f99487",
      GRAVE: "0xA0224171d185bAFD583a6ecd642B9915951cF068",
      GSHARE: "0xA90148b17ED0fddE5a79f2855ab1Dfebb1F0F7eb",
      ZOMBIE: "0xdB664527b5e53161B4EE255d8Faed7cB6a136b3C",
      ZSHARE: "0x00aDC7f70d86AB6142621BC38d1BFe3eF9108AEF",
      WLRS: "0x583e0717af8ad2f749a48cbe5294c3a2180ffa13",
      WSHARE: "0x7ef1F9ADe3653eab169F283A45CCA7095Fc2113e",
      GRAPE: "0x533b61CA482Ed8521022dCC32666151300236E5b",
      WINE: "0x02Bd8B43Ed266dbA71D7EF2A31895f353C60B588",
      GLAD: "",
      GLADSHARE: "",
      ASTRO: "0xa2a36D2995D9f64Ac2dC7C6B371663751416130A",
      GAME: "0xFc2Ca2E429fF450A77DE0a212b2551865f9d22b5",
    },
    genesisPools: {
      whiteList: "",
      genesisPool: "",
      genesisPoolWl: "",
    },
  },
};

export interface BankInfo {
  depositTokenName: Symbol;
  poolId: number;
  earnTokenName: Symbol;
  isGenesisPool?: boolean;
}

export interface Bank extends BankInfo {
  poolName: string;
  TVL: number;
  dailyAPR: number;
  yearlyAPR: number;
}

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  "GLAD-GLADSHARE LP": {
    poolId: 0,
    depositTokenName: Symbol.TOMB_TSHARE_LP,
    earnTokenName: Symbol.TSHARE,
  },
  "GLAD-AVAX LP": {
    poolId: 1,
    depositTokenName: Symbol.TOMB_AVAX_LP,
    earnTokenName: Symbol.TSHARE,
  },
  "GLADSHARE-GLAD LP": {
    poolId: 2,
    depositTokenName: Symbol.TSHARE_TOMB_LP,
    earnTokenName: Symbol.TSHARE,
  },
};

export const genesisPools: { [contractName: string]: BankInfo } = {
  "GLADSHARE-AVAX LP": {
    poolId: 0,
    depositTokenName: Symbol.TSHARE_AVAX_LP,
    earnTokenName: Symbol.TOMB,
    isGenesisPool: true,
  },
  "GLAD-AVAX LP": {
    poolId: 1,
    depositTokenName: Symbol.TOMB_AVAX_LP,
    earnTokenName: Symbol.TOMB,
    isGenesisPool: true,
  },
  USDC: {
    poolId: 2,
    depositTokenName: Symbol.USDC,
    earnTokenName: Symbol.TOMB,
    isGenesisPool: true,
  },
  WAVAX: {
    poolId: 3,
    depositTokenName: Symbol.WAVAX,
    earnTokenName: Symbol.TOMB,
    isGenesisPool: true,
  },
  SIFU: {
    poolId: 4,
    depositTokenName: Symbol.SIFU,
    earnTokenName: Symbol.TOMB,
    isGenesisPool: true,
  },
  GAME: {
    poolId: 5,
    depositTokenName: Symbol.SIFU,
    earnTokenName: Symbol.TOMB,
    isGenesisPool: true,
  },
};


let branchConfs = {
  'release': "production",
  'release-test': "production",
  'release-dev': "development",
  'beta-release': "development",
  'beta-release-test': "development",
  'beta-release-dev': "development",
}

export const selectedConf: string = branchConfs[process.env.REACT_APP_CF_PAGES_BRANCH] || process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV || 'development';

export default configurations[selectedConf];
