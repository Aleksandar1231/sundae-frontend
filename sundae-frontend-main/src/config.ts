// import { ChainId } from '@pancakeswap-libs/sdk';
import { ChainId } from '@traderjoe-xyz/sdk';
import { Configuration } from './tomb-finance/config';
import { BankInfo } from './tomb-finance';

const configurations: { [env: string]: Configuration } = {
  production: {
    chainId: ChainId.AVALANCHE,
    networkName: 'Avalanche Mainnet',
    ftmscanUrl: 'https://snowtrace.io/',
    defaultProvider: 'https://rpc.ankr.com/avalanche',
    deployments: require('./tomb-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      WFTM: ['0xd586e7f844cea2f87f50152665bcbc2c279d8d70', 18], //DAI
      FUSDT: ['0xc7198437980c041c805A1EDcbA50c1Ce5db95118', 6], // This is actually usdc on mainnet not fusdt
      WAVAX: ['0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', 18], //WAVAX
      MIM: ['0x130966628846BFd36ff31a822705796e8cb8C18D', 18],
      SHIBA: ['0x9ba3e4f84a34df4e08c112e1a0ff148b81655615', 9],
      BELUGA: ['0x4A13a2cf881f5378DEF61E430139Ed26d843Df9A', 18],
      BIFI: ['0xd6070ae98b8069de6B494332d1A1a81B6179D960', 18],
      BLOOM: ['0x9B2e37cDC711CfcAC1E1482B5741c74dd3924199', 9],
      DAI: ['0xd586e7f844cea2f87f50152665bcbc2c279d8d70', 18], //DAI
      CREAM: ['0xAE21d31a6494829a9E4B2B291F4984AAE8121757', 18], //CREAM
      'CREAM-CSHARE LP': ['0xeC1e129BbAac3DdE156643F5d41FC9b5a59033a7', 18], //CREAM-CSHARE
      'CREAM-AVAX LP': ['0x00C87ce7188F7652d0C0940274cEC5db62f1e825', 18], //CREAM-AVAX
      'CSHARE-AVAX LP': ['0xbD61dFAd83Fc19960476abca1324FfD798234c66', 18], //CSHARE-AVAX
      'CSHARE': ['0x155f794b56353533E0AfBF76e1B1FC57DFAd5Bd7', 18], //CSHARE
      'FUDGE-DAI LP': ['0xE367414f29E247b2D92edd610aA6Dd5A7FD631BA', 18],
      'FUDGE-AVAX LP': ['0xE367414f29E247b2D92edd610aA6Dd5A7FD631BA', 18], //FUDGE-DAI
      'STRAW-DAI LP': ['0xf71149502bc064a7Da58C4E275DA7896ed3f14F3', 18], //STRAW-DAI
      'STRAW': ['0xf8D0C6c3ddC03F43A0687847f2b34bfd6941C2A2', 18], //STRAW
      'USDT-FTM LP': ['0xa6908C7E3Be8F4Cd2eB704B5cB73583eBF56Ee62', 18], //UDST-DAI
      'FUDGE-STRAW LP': ['0x771d02022102a67931De319782D0507511982d56', 18], //FUDGE-STRAW
      'FUDGE': ['0xD9FF12172803c072a36785DeFea1Aa981A6A0C18', 18], //FUDGE
      'USDT-BNB-LP': ['0x781655d802670bbA3c89aeBaaEa59D3182fD755D', 18],
      'MIM-WAVAX-LP': ['0x781655d802670bba3c89aebaaea59d3182fd755d', 18],
      'STRAW-AVAX LP': ['0x5eeF38855090ccc49A1b7391F4C7B9efbDFE1456', 18],
      'FUDGE-CREAM LP': ['0x39f3F5aB8b49a00Ba8121CC17C2B84943C885a62', 18],
      'CREAM-STRAW LP': ['0x89BA86a9e3E0821493591b1fa07183F358b5B7d2', 18],
    },
    baseLaunchDate: new Date('2021-06-02 13:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    masonryLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
  },
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  /*
  Explanation:
  name: description of the card
  poolId: the poolId assigned in the contract
  sectionInUI: way to distinguish in which of the 3 pool groups it should be listed
        - 0 = Single asset stake pools
        - 1 = LP asset staking rewarding TOMB
        - 2 = LP asset staking rewarding TSHARE
  contract: the contract name which will be loaded from the deployment.environmnet.json
  depositTokenName : the name of the token to be deposited
  earnTokenName: the rewarded token
  finished: will disable the pool on the UI if set to true
  sort: the order of the pool
  */
 
  FudgeDaiLPTShareRewardPool: {
    name: 'Earn STRAW by FUDGE-DAI LP',
    poolId: 0,
    sectionInUI: 2,
    contract: 'FudgeDaiLPTShareRewardPool',
    depositTokenName: 'FUDGE-DAI LP',
    earnTokenName: 'STRAW',
    finished: false,
    multiplier: '70%',
    buyLink: 'https://traderjoexyz.com/pool/0xd586E7F844cEa2F87f50152665BCbc2C279D8d70/0xD9FF12172803c072a36785DeFea1Aa981A6A0C18#/',
    site: '/',
    sort: 8,
    closedForStaking: false,
  },
  StrawAvaxLPTShareRewardPool: {
    name: 'Earn STRAW by STRAW-AVAX LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'StrawAvaxLPTShareRewardPool',
    depositTokenName: 'STRAW-AVAX LP',
    earnTokenName: 'STRAW',
    finished: false,
    multiplier: '0% ',
    buyLink: 'https://traderjoexyz.com/pool/AVAX/0xf8D0C6c3ddC03F43A0687847f2b34bfd6941C2A2',
    site: '/',
    sort: 9,
    closedForStaking: true,
  },
  StrawDaiLPTShareRewardPool: {
    name: 'Earn STRAW by STRAW-DAI LP',
    poolId: 7,
    sectionInUI: 2,
    contract: 'StrawDaiLPTShareRewardPool',
    depositTokenName: 'STRAW-DAI LP',
    earnTokenName: 'STRAW',
    finished: false,
    multiplier: '30%',
    buyLink: 'https://traderjoexyz.com/pool/0xd586E7F844cEa2F87f50152665BCbc2C279D8d70/0xf8D0C6c3ddC03F43A0687847f2b34bfd6941C2A2',
    site: '/',
    sort: 9,
    closedForStaking: false,
  },
  FudgeStrawLPTShareRewardPool: {
    name: 'Earn STRAW by FUDGE-STRAW LP',
    poolId: 2,
    sectionInUI: 0,
    contract: 'FudgeStrawLPTShareRewardPool',
    depositTokenName: 'FUDGE-STRAW LP',
    earnTokenName: 'STRAW',
    finished: false,
    multiplier: '0x',
    buyLink: 'https://traderjoexyz.com/pool/0xD9FF12172803c072a36785DeFea1Aa981A6A0C18/0xf8D0C6c3ddC03F43A0687847f2b34bfd6941C2A2',
    site: null,
    sort: 14,
    closedForStaking: false,
  },
  FudgeLPTShareRewardPool: {
    name: 'Earn STRAW by Staking FUDGE',
    poolId: 3,
    sectionInUI: 2,
    contract: 'FudgeLPTShareRewardPool',
    depositTokenName: 'FUDGE',
    earnTokenName: 'STRAW',
    finished: false,
    multiplier: '0%',
    buyLink: 'https://app.bogged.finance/avax/swap?tokenIn=0xd586E7F844cEa2F87f50152665BCbc2C279D8d70&tokenOut=0xD9FF12172803c072a36785DeFea1Aa981A6A0C18',
    site: null,
    sort: 11,
    closedForStaking: true,
  },
  FudgeCreamLPTShareRewardPool: {
    name: 'Earn STRAW by FUDGE-CREAM LP',
    poolId: 4,
    sectionInUI: 0,
    contract: 'FudgeCreamLPTShareRewardPool',
    depositTokenName: 'FUDGE-CREAM LP',
    earnTokenName: 'STRAW',
    finished: false,
    multiplier: '0x',
    buyLink: 'https://traderjoexyz.com/pool/0xAE21d31a6494829a9E4B2B291F4984AAE8121757/0xD9FF12172803c072a36785DeFea1Aa981A6A0C18',
    site: '',
    sort: 12,
    closedForStaking: false,
  },
  CreamStrawLPTShareRewardPool: {
    name: 'Earn STRAW by CREAM-STRAW LP',
    poolId: 5,
    sectionInUI: 0,
    contract: 'CreamStrawLPTShareRewardPool',
    depositTokenName: 'CREAM-STRAW LP',
    earnTokenName: 'STRAW',
    finished: false,
    multiplier: '0x',
    buyLink: 'https://traderjoexyz.com/pool/0xAE21d31a6494829a9E4B2B291F4984AAE8121757/0xf8D0C6c3ddC03F43A0687847f2b34bfd6941C2A2',
    site: '',
    sort: 13,
    closedForStaking: false,
  },
  CreamRewardPool: {
    name: 'Earn STRAW by staking CREAM',
    poolId: 6,
    sectionInUI: 0,
    contract: 'CreamRewardPool',
    depositTokenName: 'CREAM',
    earnTokenName: 'STRAW',
    finished: false,
    multiplier: '0x',
    site: null,
    buyLink: 'https://traderjoexyz.com/trade?outputCurrency=0xAE21d31a6494829a9E4B2B291F4984AAE8121757#/',
    sort: 10,
    closedForStaking: false,
  },

  FudgeNode: {
    name: 'Generate FUDGE with Nodes',
    poolId: 0,
    sectionInUI: 3,
    contract: 'FudgeNode',
    depositTokenName: 'FUDGE',
    earnTokenName: 'FUDGE',
    finished: false,
    multiplier:null,
    site: null,
    buyLink: 'https://traderjoexyz.com/trade#/0xD9FF12172803c072a36785DeFea1Aa981A6A0C18',
    sort: 2,
    closedForStaking: false,
  },
};

export const moralisConfiguration = {
  appId: '229JUQVRbdYyHGNObmCA9LqmgpPayWJc1l3oUBL6',
  serverUrl: 'https://metunprlpqub.usemoralis.com:2053/server'
}

export const lotteries = [
  {
    title: 'Fudge Node',
    table: 'FudgeNode',
    entries: 1
  },
  {
    title: 'LP NODE',
    table: 'LPNode',
    entries: 10
  }
]

export default configurations['production'];
