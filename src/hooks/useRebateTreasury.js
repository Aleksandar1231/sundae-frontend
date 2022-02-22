import { useEffect, useState } from 'react';
import Web3 from 'web3';

const RebateTreasuryABI = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DENOMINATOR',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'Tomb',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'TombOracle',
    outputs: [{ internalType: 'contract IOracle', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'Treasury',
    outputs: [{ internalType: 'contract ITreasury', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'WFTM',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'assets',
    outputs: [
      { internalType: 'bool', name: 'isAdded', type: 'bool' },
      { internalType: 'uint256', name: 'multiplier', type: 'uint256' },
      { internalType: 'address', name: 'oracle', type: 'address' },
      { internalType: 'bool', name: 'isLP', type: 'bool' },
      { internalType: 'address', name: 'pair', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'bond',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bondFactor',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bondThreshold',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bondVesting',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'buybackAmount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address payable', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'call',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'payable',
    type: 'function',
  },
  { inputs: [], name: 'claimRewards', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'claimableTomb',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBondPremium',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
    name: 'getTokenPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTombPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'getTombReturn',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastBuyback',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address[]', name: 'tokens', type: 'address[]' }],
    name: 'redeemAssetsForBuyback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [],
    name: 'secondaryFactor',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'secondaryThreshold',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'bool', name: 'isAdded', type: 'bool' },
      { internalType: 'uint256', name: 'multiplier', type: 'uint256' },
      { internalType: 'address', name: 'oracle', type: 'address' },
      { internalType: 'bool', name: 'isLP', type: 'bool' },
      { internalType: 'address', name: 'pair', type: 'address' },
    ],
    name: 'setAsset',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'primaryThreshold', type: 'uint256' },
      { internalType: 'uint256', name: 'primaryFactor', type: 'uint256' },
      { internalType: 'uint256', name: 'secondThreshold', type: 'uint256' },
      { internalType: 'uint256', name: 'secondFactor', type: 'uint256' },
      { internalType: 'uint256', name: 'vestingPeriod', type: 'uint256' },
    ],
    name: 'setBondParameters',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'tomb', type: 'address' }],
    name: 'setTomb',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'oracle', type: 'address' }],
    name: 'setTombOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'treasury', type: 'address' }],
    name: 'setTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalVested',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'vesting',
    outputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'period', type: 'uint256' },
      { internalType: 'uint256', name: 'end', type: 'uint256' },
      { internalType: 'uint256', name: 'claimed', type: 'uint256' },
      { internalType: 'uint256', name: 'lastClaimed', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
const ERC20ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  { payable: true, stateMutability: 'payable', type: 'fallback' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
];

const web3 = new Web3('https://api.avax.network/ext/bc/C/rpc');
const RebateTreasury = new web3.eth.Contract(RebateTreasuryABI, '0xd36d480D56CA62767F367ECAfa07e33bccc22286');
const Threeomb = new web3.eth.Contract(ERC20ABI, '0xD9FF12172803c072a36785DeFea1Aa981A6A0C18');

const assetList = [
  '0x155f794b56353533E0AfBF76e1B1FC57DFAd5Bd7', // cshare
  '0xbD61dFAd83Fc19960476abca1324FfD798234c66', // cshare/avax LP
  '0xE367414f29E247b2D92edd610aA6Dd5A7FD631BA', // fudge/dai
  '0xf8D0C6c3ddC03F43A0687847f2b34bfd6941C2A2', // straw
  '0x5eeF38855090ccc49A1b7391F4C7B9efbDFE1456', // straw/avax
  '0x00C87ce7188F7652d0C0940274cEC5db62f1e825', // cream avax lp
  '0xAE21d31a6494829a9E4B2B291F4984AAE8121757', // cream
];

function useRebateTreasury() {
  const [tombPrice, setTombPrice] = useState(0);
  const [tombAvailable, setTombAvailable] = useState(0);
  const [bondPremium, setBondPremium] = useState(0);
  const [bondVesting, setBondVesting] = useState(0);
  const [assets, setAssets] = useState(
    assetList.map((asset) => ({
      token: asset,
      params: {
        multiplier: 0,
        isLP: false,
      },
      price: 0,
    })),
  );

  async function update() {
    const [tombPrice, tombBalance, vestedTomb, bondPremium, bondVesting, assetParams, assetPrices] = await Promise.all([
      RebateTreasury.methods.getTombPrice().call(),
      Threeomb.methods.balanceOf(RebateTreasury._address).call(),
      RebateTreasury.methods.totalVested().call(),
      RebateTreasury.methods.getBondPremium().call(),
      RebateTreasury.methods.bondVesting().call(),
      Promise.all(assetList.map((asset) => RebateTreasury.methods.assets(asset).call())),
      Promise.all(assetList.map((asset) => RebateTreasury.methods.getTokenPrice(asset).call())),
    ]);

    setTombPrice(+web3.utils.fromWei(tombPrice));
    setTombAvailable(+web3.utils.fromWei(tombBalance) - +web3.utils.fromWei(vestedTomb));
    setBondPremium(+bondPremium / 10000);
    setBondVesting(+bondVesting / 10000);

    const assets = [];
    for (let a = 0; a < assetList.length; a++) {
      assets.push({
        token: assetList[a],
        params: {
          multiplier: assetParams[a].multiplier,
          isLP: assetParams[a].isLP,
        },
        price: +web3.utils.fromWei(assetPrices[a]),
      });
    }
    setAssets(assets);
  }

  useEffect(() => {
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return {
    RebateTreasury,
    tombPrice,
    bondPremium,
    bondVesting,
    tombAvailable,
    assets,
  };
}

export default useRebateTreasury;
