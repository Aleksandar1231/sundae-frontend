// import { Fetcher, Route, Token } from '@uniswap/sdk';
//import { Fetcher as FetcherSpirit, Token as TokenSpirit } from '@traderjoe-xyz/sdk';
import { Fetcher, Route, Token } from '@traderjoe-xyz/sdk';
import { Configuration } from './config';
import { ContractName, TokenStat, AllocationTime, LPStat, Bank, PoolStats, TShareSwapperStat } from './types';
import { BigNumber, Contract, ethers, Event, EventFilter } from 'ethers';
import { decimalToBalance } from './ether-utils';
import { TransactionResponse } from '@ethersproject/providers';
import ERC20 from './ERC20';
import { getFullDisplayBalance, getDisplayBalance } from '../utils/formatBalance';
import { getDefaultProvider } from '../utils/provider';
import IUniswapV2PairABI from './IUniswapV2Pair.abi.json';
import config, { bankDefinitions } from '../config';
import moment from 'moment';
import { parseUnits } from 'ethers/lib/utils';
import { FTM_TICKER, SPOOKY_ROUTER_ADDR, TOMB_TICKER, AVAX_TICKER, TSHARE_TICKER } from '../utils/constants';
/**
 * An API module of 2omb Finance contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class TombFinance {
  myAccount: string;
  provider: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  config: Configuration;
  contracts: { [name: string]: Contract };
  externalTokens: { [name: string]: ERC20 };
  masonryVersionOfUser?: string;
  masonryFundEvents: Array<Event> = [];
  lastEpoch: number = 0;

  TOMBWFTM_LP: Contract;
  TOMB: ERC20;
  TSHARE: ERC20;
  TBOND: ERC20;
  WAVAX: ERC20;
  FTM: ERC20;
  DAI: ERC20;
  MIM: ERC20;



  constructor(cfg: Configuration) {
    const { deployments, externalTokens } = cfg;
    const provider = getDefaultProvider();

    // loads contracts from deployments
    this.contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      this.contracts[name] = new Contract(deployment.address, deployment.abi, provider);
    }
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal);
    }
    this.TOMB = new ERC20(deployments.tomb.address, provider, 'FUDGE');
    this.TSHARE = new ERC20(deployments.tShare.address, provider, 'STRAW');
    this.TBOND = new ERC20(deployments.tBond.address, provider, 'CARAML');
    this.WAVAX = this.externalTokens['WAVAX'];
    this.DAI = this.externalTokens['DAI'];
    this.FTM = this.externalTokens['WFTM'];
    this.MIM = this.externalTokens['MIM']

    // Uniswap V2 Pair
    this.TOMBWFTM_LP = new Contract(externalTokens['FUDGE-DAI LP'][0], IUniswapV2PairABI, provider);

    this.config = cfg;
    this.provider = provider;
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: any, account: string) {
    const newProvider = new ethers.providers.Web3Provider(provider, this.config.chainId);
    this.signer = newProvider.getSigner(0);
    this.myAccount = account;
    for (const [name, contract] of Object.entries(this.contracts)) {
      this.contracts[name] = contract.connect(this.signer);
    }
    const tokens = [this.TOMB, this.TSHARE, this.TBOND, ...Object.values(this.externalTokens)];
    for (const token of tokens) {
      token.connect(this.signer);
    }
    this.TOMBWFTM_LP = this.TOMBWFTM_LP.connect(this.signer);
    console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
    this.fetchMasonryVersionOfUser()
      .then((version) => (this.masonryVersionOfUser = version))
      .catch((err) => {
        console.error(`Failed to fetch masonry version: ${err.stack}`);
        this.masonryVersionOfUser = 'latest';
      });
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }
  //===================================================================
  //=====================     NODE API   ===============================
  //=========================== START ===================================
  //===================================================================

  async getNodes(contract: string, user: string): Promise<BigNumber[]> {
    return await this.contracts[contract].getNodes(user);
  }

  async getMaxPayout(contract: string, user: string): Promise<BigNumber[]> {
    return await this.contracts[contract].maxPayout(user);
  }

  async getDailyDrip(contract: string, user: string): Promise<BigNumber[]> {
    return await this.contracts[contract].getDayDripEstimate(user);
  }

  async getUserDetails(contract: string, user: string): Promise<BigNumber[]> {
    return await this.contracts[contract].users(user);
  }
  
  async getTotalNodes(contract: string): Promise<BigNumber[]> {
    return await this.contracts[contract].getTotalNodes();
  }

  async getFudgeNodes(): Promise<BigNumber[]> {
      const {FudgeNode} = this.contracts;
    return await FudgeNode.getTotalNodes();
  }

  async claimedBalanceNode(poolName: ContractName, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      let userInfo = await pool.users(account);
      return await userInfo.total_claims;
    } catch (err) {
      console.error(`Failed to call userInfo() on pool ${pool.address}: ${err}`);
      return BigNumber.from(0);
    }
  }

  async getNodePrice(poolName: ContractName, poolId: Number): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      return await pool.tierAmounts(poolId);
    } catch (err) {
      console.error(`Failed to call tierAmounts on contract ${pool.address}: ${err}`);
      return BigNumber.from(0);
    }
  }

  async compound(poolName: ContractName, poolId: Number, sectionInUI: Number): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    //By passing 0 as the amount, we are asking the contract to only redeem the reward and not the currently staked token
    return sectionInUI !== 3
    ? await pool.withdraw(poolId, 0)
    : await pool.compound();
  }




  //===================================================================
  //===================== GET ASSET STATS =============================
  //===================FROM SPOOKY TO DISPLAY =========================
  //=========================IN HOME PAGE==============================
  //===================================================================

  async getTombStat(): Promise<TokenStat> {
    const { TombFtmRewardPool } = this.contracts;
    const supply = await this.TOMB.totalSupply();
    const tombRewardPoolSupply = await this.TOMB.balanceOf(TombFtmRewardPool.address);
    // const tombRewardPoolSupplyOld = await this.TOMB.balanceOf(TombFtmLpTombRewardPoolOld.address);
    const tombCirculatingSupply = supply.sub(tombRewardPoolSupply);
    // .sub(tombRewardPoolSupplyOld);
    const priceInFTM = await this.getTokenPriceFromPancakeswap(this.TOMB);
    const priceOfOneFTM = await this.getWFTMPriceFromPancakeswap();
    const priceOfTombInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);

    return {
      tokenInFtm: priceInFTM,
      priceInDollars: priceOfTombInDollars,
      totalSupply: getDisplayBalance(supply, this.TOMB.decimal, 0),
      circulatingSupply: getDisplayBalance(tombCirculatingSupply, this.TOMB.decimal, 0),
    };
  }

  /**
   * Calculates various stats for the requested LP
   * @param name of the LP token to load stats for
   * @returns
   */
  async getLPStat(name: string): Promise<LPStat> {
    const lpToken = this.externalTokens[name];
    const lpTokenSupplyBN = await lpToken.totalSupply();
    const lpTokenSupply = getDisplayBalance(lpTokenSupplyBN, 18);
    const token0 = name.startsWith('FUDGE') ? this.TOMB : this.TSHARE;
    const isTomb = name.startsWith('FUDGE');
    const tokenAmountBN = await token0.balanceOf(lpToken.address);
    const tokenAmount = getDisplayBalance(tokenAmountBN, 18);

    const ftmAmountBN = await this.FTM.balanceOf(lpToken.address);
    const ftmAmount = getDisplayBalance(ftmAmountBN, 18);
    const tokenAmountInOneLP = Number(tokenAmount) / Number(lpTokenSupply);
    const ftmAmountInOneLP = Number(ftmAmount) / Number(lpTokenSupply);
    const lpTokenPrice = await this.getLPTokenPrice(lpToken, token0, isTomb, false);
    const lpTokenPriceFixed = Number(lpTokenPrice).toFixed(2).toString();
    const liquidity = (Number(lpTokenSupply) * Number(lpTokenPrice)).toFixed(2).toString();
    return {
      tokenAmount: tokenAmountInOneLP.toFixed(2).toString(),
      ftmAmount: ftmAmountInOneLP.toFixed(2).toString(),
      priceOfOne: lpTokenPriceFixed,
      totalLiquidity: liquidity,
      totalSupply: Number(lpTokenSupply).toFixed(2).toString(),
    };
  }

  /**
   * Use this method to get price for Tomb
   * @returns TokenStat for TBOND
   * priceInFTM
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getBondStat(): Promise<TokenStat> {
    const { Treasury } = this.contracts;
    const tombStat = await this.getTombStat();
    const bondTombRatioBN = await Treasury.getBondPremiumRate();
    const modifier = bondTombRatioBN / 1e18 > 1 ? bondTombRatioBN / 1e18 : 1;
    const bondPriceInFTM = (Number(tombStat.tokenInFtm)).toFixed(2);
    const priceOfTBondInDollars = (Number(tombStat.priceInDollars)* modifier).toFixed(2);
    const supply = await this.TBOND.displayedTotalSupply();
    return {
      tokenInFtm: bondPriceInFTM,
      priceInDollars: priceOfTBondInDollars,
      totalSupply: supply,
      circulatingSupply: supply,
    };
  }

  /**
   * @returns TokenStat for TSHARE
   * priceInFTM
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getShareStat(): Promise<TokenStat> {
    const { TombFtmLPTShareRewardPool } = this.contracts;

    const supply = await this.TSHARE.totalSupply();

    const priceInFTM = await this.getTokenPriceFromPancakeswap(this.TSHARE);
    const tombRewardPoolSupply = await this.TSHARE.balanceOf(TombFtmLPTShareRewardPool.address);
    const tShareCirculatingSupply = supply.sub(tombRewardPoolSupply);
    const priceOfOneFTM = await this.getWFTMPriceFromPancakeswap();
    const priceOfSharesInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);

    return {
      tokenInFtm: priceInFTM,
      priceInDollars: priceOfSharesInDollars,
      totalSupply: '70000',
      circulatingSupply: getDisplayBalance(tShareCirculatingSupply, this.TSHARE.decimal, 0),
    };
  }

  async getTombStatInEstimatedTWAP(): Promise<TokenStat> {
    const { SeigniorageOracle, TombFtmRewardPool } = this.contracts;
    const expectedPrice = await SeigniorageOracle.twap(this.TOMB.address, ethers.utils.parseEther('1'));
    console.log(expectedPrice)
    const supply = await this.TOMB.totalSupply();
    const tombRewardPoolSupply = await this.TOMB.balanceOf(TombFtmRewardPool.address);
    const tombCirculatingSupply = supply.sub(tombRewardPoolSupply);
    return {
      tokenInFtm: getDisplayBalance(expectedPrice),
      priceInDollars: getDisplayBalance(expectedPrice),
      totalSupply: getDisplayBalance(supply, this.TOMB.decimal, 0),
      circulatingSupply: getDisplayBalance(tombCirculatingSupply, this.TOMB.decimal, 0),
    };
  }

  async getTombPriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getTombUpdatedPrice();
  }

  async getBondsPurchasable(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getBurnableTombLeft();
  }

  /**
   * Calculates the TVL, APR and daily APR of a provided pool/bank
   * @param bank
   * @returns
   */
  async getPoolAPRs(bank: Bank): Promise<PoolStats> {
    if (this.myAccount === undefined) return;
    const depositToken = bank.depositToken;
    const poolContract = this.contracts[bank.contract];

    if (bank.sectionInUI === 3) {
      const [depositTokenPrice, points, totalPoints, tierAmount, poolBalance, totalBalance, dripRate, dailyUserDrip] = await Promise.all([
        this.getDepositTokenPriceInDollars(bank.depositTokenName, depositToken),
        poolContract.tierAllocPoints(bank.poolId),
        poolContract.totalAllocPoints(),
        poolContract.tierAmounts(bank.poolId),
        poolContract.getBalancePool(),
        depositToken.balanceOf(bank.address),
        poolContract.dripRate(),
        poolContract.getDayDripEstimate(this.myAccount),
      ]);
      const stakeAmount = Number(getDisplayBalance(tierAmount))


      const dailyDrip = totalPoints && +totalPoints > 0
        ? getDisplayBalance(poolBalance.mul(BigNumber.from(86400)).mul(points).div(totalPoints).div(dripRate))
        : 0;
      const dailyDripAPR = (Number(dailyDrip) / stakeAmount) * 100;
      const yearlyDripAPR = (Number(dailyDrip) * 365 / stakeAmount) * 100;

      const dailyDripUser = Number(getDisplayBalance(dailyUserDrip));
      const yearlyDripUser = Number(dailyDripUser) * 365;

      const TVL = Number(depositTokenPrice) * Number(getDisplayBalance(totalBalance, depositToken.decimal));

      return {
        userDailyBurst: dailyDripUser.toFixed(2).toString(),
        userYearlyBurst: yearlyDripUser.toFixed(2).toString(),
        dailyAPR: dailyDripAPR.toFixed(2).toString(),
        yearlyAPR: yearlyDripAPR.toFixed(2).toString(),
        TVL: TVL.toFixed(2).toString(),
      };
    } else {
      const depositTokenPrice = await this.getDepositTokenPriceInDollars(bank.depositTokenName, depositToken);

      const stakeInPool = await depositToken.balanceOf(bank.address);

      const TVL = Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));

      let stat = bank.earnTokenName === 'FUDGE' ? await this.getTombStat() : await this.getShareStat();

      const tokenPerSecond = await this.getTokenPerSecond(
        bank.earnTokenName,
        bank.contract,
        poolContract,
        bank.depositTokenName,
      );

      let tokenPerHour = tokenPerSecond.mul(60).mul(60);

      const totalRewardPricePerYear =
        Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24).mul(365)));

      const totalRewardPricePerDay = Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24)));

      const totalStakingTokenInPool =
        Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));

      const dailyAPR = (totalRewardPricePerDay / totalStakingTokenInPool) * 100;

      const yearlyAPR = (totalRewardPricePerYear / totalStakingTokenInPool) * 100;
      return {
        dailyAPR: dailyAPR.toFixed(2).toString(),
        yearlyAPR: yearlyAPR.toFixed(2).toString(),
        TVL: TVL.toFixed(2).toString(),
      };
    }
  }


  /**
   * Method to return the amount of tokens the pool yields per second
   * @param earnTokenName the name of the token that the pool is earning
   * @param contractName the contract of the pool/bank
   * @param poolContract the actual contract of the pool
   * @returns
   */
  async getTokenPerSecond(
    earnTokenName: string,
    contractName: string,
    poolContract: Contract,
    depositTokenName: string,
  ) {
    if (earnTokenName === 'FUDGE') {
      if (!contractName.endsWith('TombRewardPool')) {
        const rewardPerSecond = await poolContract.tombPerSecond();
        if (depositTokenName === 'CSHARE') {
          return rewardPerSecond.mul(0).div(2000).div(24);
        } else if (depositTokenName === 'CREAM') {
          return rewardPerSecond.mul(0).div(2000).div(24);
        } else if (depositTokenName === 'WAVAX') {
          return rewardPerSecond.mul(0).div(2000).div(24);
        } else if (depositTokenName === 'DAI') {
          return rewardPerSecond.mul(0).div(2000).div(24);
        } else if (depositTokenName === 'CREAM-AVAX LP') {
          return rewardPerSecond.mul(0).div(2000).div(24);
        } else if (depositTokenName === 'CSHARE-AVAX LP') {
          return rewardPerSecond.mul(0).div(2000).div(24);
        } else if (depositTokenName === 'FUDGE-DAI LP') {
          return rewardPerSecond.mul(0).div(2000).div(24);
        }
        return rewardPerSecond.div(24);
      }
      const poolStartTime = await poolContract.poolStartTime();
      const startDateTime = new Date(poolStartTime.toNumber() * 1000);
      const FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;
      if (Date.now() - startDateTime.getTime() > FOUR_DAYS) {
        return await poolContract.epochTombPerSecond(1);
      }
      return await poolContract.epochTombPerSecond(0);
    }
    const rewardPerSecond = await poolContract.tSharePerSecond();
    if (depositTokenName === 'FUDGE') {
      return rewardPerSecond.mul(0).div(55000);
    } else if (depositTokenName === 'FUDGE-STRAW LP') {
      return rewardPerSecond.mul(0).div(55000);
    } else if (depositTokenName === 'STRAW-DAI LP') {
      return rewardPerSecond.mul(16500).div(55000);
    } else if (depositTokenName === 'STRAW-AVAX LP') {
      return rewardPerSecond.mul(0).div(55000);
    } else if (depositTokenName === 'CREAM-STRAW LP') {
      return rewardPerSecond.mul(0).div(55000);
    } else if (depositTokenName === 'FUDGE-DAI LP') {
      return rewardPerSecond.mul(38500).div(55000);
    } else {
      return rewardPerSecond.mul(0).div(55000);
    }
  }
  async getAVAXPriceFromPancakeswap(): Promise<string> {
    //not here
    const ready = await this.provider.ready;
    if (!ready) return;
    const { WAVAX, MIM } = this.externalTokens;
    try {
      const fusdt_wftm_lp_pair = this.externalTokens['MIM-WAVAX-LP'];
      let ftm_amount_BN = await WAVAX.balanceOf(fusdt_wftm_lp_pair.address);
      let ftm_amount = Number(getFullDisplayBalance(ftm_amount_BN, WAVAX.decimal));
      let fusdt_amount_BN = await MIM.balanceOf(fusdt_wftm_lp_pair.address);
      let fusdt_amount = Number(getFullDisplayBalance(fusdt_amount_BN, MIM.decimal));
      return (fusdt_amount / ftm_amount).toString();
    } catch (err) {
      console.error(`Failed to fetch token price of AVAX: ${err}`);
    }
  }
  async getWAVAXPriceFromPancakeswap(): Promise<string> {
    //not here
    const ready = await this.provider.ready;
    if (!ready) return;
    const { WAVAX, MIM } = this.externalTokens;
    try {
      const fusdt_wftm_lp_pair = this.externalTokens['MIM-WAVAX-LP'];
      let ftm_amount_BN = await WAVAX.balanceOf(fusdt_wftm_lp_pair.address);
      let ftm_amount = Number(getFullDisplayBalance(ftm_amount_BN, WAVAX.decimal));
      let fusdt_amount_BN = await MIM.balanceOf(fusdt_wftm_lp_pair.address);
      let fusdt_amount = Number(getFullDisplayBalance(fusdt_amount_BN, MIM.decimal));
      return (fusdt_amount / ftm_amount).toString();
    } catch (err) {
      console.error(`Failed to fetch token price of AVAX: ${err}`);
    }
  }


  async getCSHAREPriceFromPancakeswap(): Promise<string> {
    //not here
    const ready = await this.provider.ready;
    const wavaxInDollars = await this.getWAVAXPriceFromPancakeswap();
    if (!ready) return;
    const { WAVAX, CSHARE } = this.externalTokens;
    try {
      const fusdt_wftm_lp_pair = this.externalTokens['CSHARE-AVAX LP'];
      let ftm_amount_BN = await WAVAX.balanceOf(fusdt_wftm_lp_pair.address);
      let ftm_amount = Number(getFullDisplayBalance(ftm_amount_BN, WAVAX.decimal));
      let fusdt_amount_BN = await CSHARE.balanceOf(fusdt_wftm_lp_pair.address);
      let fusdt_amount = Number(getFullDisplayBalance(fusdt_amount_BN, CSHARE.decimal));
      let cshare_price = (ftm_amount / fusdt_amount) * Number(wavaxInDollars);
      return cshare_price.toString();

    } catch (err) {
      console.error(`Failed to fetch token price of AVAX: ${err}`);
    }
  }


  async getCREAMPriceFromPancakeswap(): Promise<string> {
    //not here
    const ready = await this.provider.ready;
    const wavaxInDollars = await this.getWAVAXPriceFromPancakeswap();
    if (!ready) return;
    const { WAVAX, CREAM } = this.externalTokens;
    try {
      const fusdt_wftm_lp_pair = this.externalTokens['CREAM-AVAX LP'];
      let ftm_amount_BN = await WAVAX.balanceOf(fusdt_wftm_lp_pair.address);
      let ftm_amount = Number(getFullDisplayBalance(ftm_amount_BN, WAVAX.decimal));
      let fusdt_amount_BN = await CREAM.balanceOf(fusdt_wftm_lp_pair.address);
      let fusdt_amount = Number(getFullDisplayBalance(fusdt_amount_BN, CREAM.decimal));
      let cream_price = (ftm_amount / fusdt_amount) * Number(wavaxInDollars);
      return cream_price.toString();

    } catch (err) {
      console.error(`Failed to fetch token price of AVAX: ${err}`);
    }
  }

  async getFUDGEPriceFromPancakeswap(): Promise<string> {
    //not here
    const ready = await this.provider.ready;
    const daiInDollars = '1'
    if (!ready) return;
    const { DAI, FUDGE } = this.externalTokens;
    try {
      const fusdt_wftm_lp_pair = this.externalTokens['FUDGE-DAI LP'];
      let ftm_amount_BN = await DAI.balanceOf(fusdt_wftm_lp_pair.address);
      let ftm_amount = Number(getFullDisplayBalance(ftm_amount_BN, DAI.decimal));
      let fusdt_amount_BN = await FUDGE.balanceOf(fusdt_wftm_lp_pair.address);
      let fusdt_amount = Number(getFullDisplayBalance(fusdt_amount_BN, FUDGE.decimal));
      let cream_price = (ftm_amount / fusdt_amount);
      return cream_price.toString();

    } catch (err) {
      console.error(`Failed to fetch token price of AVAX: ${err}`);
    }
  }

  async getSTRAWPriceFromPancakeswap(): Promise<string> {
    //not here
    const ready = await this.provider.ready;
    if (!ready) return;
    const { DAI, STRAW } = this.externalTokens;
    try {
      const fusdt_wftm_lp_pair = this.externalTokens['STRAW-DAI LP'];
      let ftm_amount_BN = await DAI.balanceOf(fusdt_wftm_lp_pair.address);
      let ftm_amount = Number(getFullDisplayBalance(ftm_amount_BN, DAI.decimal));
      let fusdt_amount_BN = await STRAW.balanceOf(fusdt_wftm_lp_pair.address);
      let fusdt_amount = Number(getFullDisplayBalance(fusdt_amount_BN, STRAW.decimal));
      let cream_price = (ftm_amount / fusdt_amount);
      return cream_price.toString();

    } catch (err) {
      console.error(`Failed to fetch token price of AVAX: ${err}`);
    }
  }

  /**
   * Method to calculate the tokenPrice of the deposited asset in a pool/bank
   * If the deposited token is an LP it will find the price of its pieces
   * @param tokenName
   * @param pool
   * @param token
   * @returns
   */

  async getDepositTokenPriceInDollars(tokenName: string, token: ERC20) {
    let tokenPrice;
    const priceOfOneFtmInDollars = await this.getWFTMPriceFromPancakeswap();
    const priceOfOneAvaxInDollars = await this.getAVAXPriceFromPancakeswap();
    const priceOfOneCshareInDollars = await this.getCSHAREPriceFromPancakeswap();
    const priceOfOneCreamInDollars = await this.getCREAMPriceFromPancakeswap();
    const priceOfOneStrawInDollars = await this.getSTRAWPriceFromPancakeswap();
    if (tokenName === 'WAVAX') {
      tokenPrice = priceOfOneAvaxInDollars;
    } else if (tokenName === 'CSHARE') {
      tokenPrice = priceOfOneCshareInDollars;
    } else if (tokenName === 'CREAM') {
      tokenPrice = priceOfOneCreamInDollars;
    } else {
      if (tokenName === 'FUDGE-DAI LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.TOMB, true, false);
      } else if (tokenName === 'STRAW-DAI LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.TSHARE, false, false);
      } else if (tokenName === 'CSHARE-AVAX LP') {
        tokenPrice = await this.getLPTokenPrice(
          token,
          new ERC20('0x155f794b56353533E0AfBF76e1B1FC57DFAd5Bd7', this.provider, 'CSHARE'),
          false,
          true,
        );
      } else if (tokenName === 'STRAW-AVAX LP') {
        tokenPrice = await this.getLPV2TokenPrice(
          token,
          this.TSHARE,
          false,
        );
      } else if (tokenName === 'FUDGE-STRAW LP') {
        tokenPrice = await this.getLPV2TokenPrice(
          token,
          this.TOMB,
          true
        );
      }
      else if (tokenName === 'CREAM-STRAW LP') {
        tokenPrice = await this.getLPV2TokenPrice(
          token,
          new ERC20('0xAE21d31a6494829a9E4B2B291F4984AAE8121757', this.provider, 'CREAM'),
          false,
        );
      } else if (tokenName === 'FUDGE-CREAM LP') {
        tokenPrice = await this.getLPV2TokenPrice(
          token,
          this.TOMB,
          true
        );
      }
      else if (tokenName === 'CREAM-AVAX LP') {
        tokenPrice = await this.getLPTokenPrice(
          token,
          new ERC20('0xAE21d31a6494829a9E4B2B291F4984AAE8121757', this.provider, 'CREAM'),
          true,
          true,
        );
      } else if (tokenName === 'CREAM-CSHARE LP') {
        tokenPrice = await this.getLPTokenPrice(
          token,
          new ERC20('0x155f794b56353533E0AfBF76e1B1FC57DFAd5Bd7', this.provider, 'CSHARE'),
          true,
          true,
        );
      } else if (tokenName === 'DAI') {
        tokenPrice = priceOfOneFtmInDollars;
      } else if (tokenName === 'STRAW') {
        tokenPrice = priceOfOneStrawInDollars;
      } else {
        tokenPrice = await this.getTokenPriceFromPancakeswap(token);
        tokenPrice = (Number(tokenPrice) * Number(priceOfOneFtmInDollars)).toString();
      }
    }
    return tokenPrice;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //=========================== END ===================================
  //===================================================================

  async getCurrentEpoch(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.epoch();
  }

  async getBondOraclePriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getBondPremiumRate();
  }

  /**
   * Buy bonds with cash.
   * @param amount amount of cash to purchase bonds with.
   */
  async buyBonds(amount: string | number): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const treasuryTombPrice = await Treasury.getTombPrice();
    return await Treasury.buyBonds(decimalToBalance(amount), treasuryTombPrice);
  }

  /**
   * Redeem bonds for cash.
   * @param amount amount of bonds to redeem.
   */
  async redeemBonds(amount: string): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const priceForTomb = await Treasury.getTombPrice();
    return await Treasury.redeemBonds(decimalToBalance(amount), priceForTomb);
  }

  async getTotalValueLocked(): Promise<Number> {
    let totalValue = 0;
    for (const bankInfo of Object.values(bankDefinitions)) {
      const pool = this.contracts[bankInfo.contract];
      const token = this.externalTokens[bankInfo.depositTokenName];
      const tokenPrice = await this.getDepositTokenPriceInDollars(bankInfo.depositTokenName, token);
      const tokenAmountInPool = await token.balanceOf(pool.address);
      const value = Number(getDisplayBalance(tokenAmountInPool, token.decimal)) * Number(tokenPrice);
      const poolValue = Number.isNaN(value) ? 0 : value;
      totalValue += poolValue;
    }

    const TSHAREPrice = (await this.getShareStat()).priceInDollars;
    const masonrytShareBalanceOf = await this.TSHARE.balanceOf(this.currentMasonry().address);
    const masonryTVL = Number(getDisplayBalance(masonrytShareBalanceOf, this.TSHARE.decimal)) * Number(TSHAREPrice);

    return totalValue + masonryTVL;
  }

  /**
   * Calculates the price of an LP token
   * Reference https://github.com/DefiDebauchery/discordpricebot/blob/4da3cdb57016df108ad2d0bb0c91cd8dd5f9d834/pricebot/pricebot.py#L150
   * @param lpToken the token under calculation
   * @param token the token pair used as reference (the other one would be FTM in most cases)
   * @param isTomb sanity check for usage of tomb token or tShare
   * @returns price of the LP token
   */
  async getLPTokenPrice(lpToken: ERC20, token: ERC20, isTomb: boolean, isFake: boolean): Promise<string> {
    const totalSupply = getFullDisplayBalance(await lpToken.totalSupply(), lpToken.decimal);
    //Get amount of tokenA
    const tokenSupply = getFullDisplayBalance(await token.balanceOf(lpToken.address), token.decimal);
    const stat =
      isFake === true
        ? isTomb === true
          ? await this.getTombStatFake()
          : await this.getShareStatFake()
        : isTomb === true
          ? await this.getTombStat()
          : await this.getShareStat();
    const priceOfToken = stat.priceInDollars;
    const tokenInLP = Number(tokenSupply) / Number(totalSupply);
    const tokenPrice = (Number(priceOfToken) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
      .toString();
    return tokenPrice;
  }

  async getTombStatFake() {
    const price = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=icecream-finance&vs_currencies=usd',
    ).then((res) => res.json());
    return { priceInDollars: price['icecream-finance'].usd };
  }

  async getShareStatFake() {
    const price = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=cream-shares&vs_currencies=usd').then(
      (res) => res.json(),
    );
    return { priceInDollars: price['cream-shares'].usd };
  }

  async getLPV2TokenPrice(lpToken: ERC20, token: ERC20, isTomb: boolean): Promise<string> {
    const totalSupply = getFullDisplayBalance(await lpToken.totalSupply(), lpToken.decimal);
    //Get amount of tokenA
    const tokenSupply = getFullDisplayBalance(await token.balanceOf(lpToken.address), token.decimal);
    const stat = isTomb === true
      ? await this.getTombStat()
      : await this.getShareStat();
    const priceOfToken = stat.priceInDollars;
    console.log(priceOfToken)
    const tokenInLP = Number(tokenSupply) / Number(totalSupply);
    const tokenPrice = (Number(priceOfToken) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
      .toString();
    console.log(tokenPrice)
    return tokenPrice;
  }


  async getFudgeStat() {
    const price = await this.getFUDGEPriceFromPancakeswap()
    return price
  }

  async getStrawStat() {
    const price = await this.getSTRAWPriceFromPancakeswap()
    return price
  }


  async earnedFromBank(
    poolName: ContractName,
    earnTokenName: String,
    poolId: Number,
    account = this.myAccount,
  ): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      if (earnTokenName === 'FUDGE' && poolName.includes('Node')) {
        return await pool.getTotalRewards(account);
      } else if (earnTokenName === 'FUDGE') {
        return await pool.pendingTOMB(poolId, account);
      } else {
        return await pool.pendingShare(poolId, account);
      }
    } catch (err) {
      console.error(`Failed to call pendingShare() on pool ${pool.address}: ${err}`);
      return BigNumber.from(0);
    }
  }

  async stakedBalanceOnBank(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];

    try {
      let userInfo = await pool.userInfo(poolId, account);

      return await userInfo.amount;
    } catch (err) {
      // @ts-ignore
      console.error(`Failed to call userInfo() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  /**
   * Deposits token to given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
   async stake(poolName: ContractName, poolId: Number, sectionInUI: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];

    return sectionInUI !== 3 
      ? await pool.deposit(poolId, amount)
      : await pool.create(poolId, amount);
  }

  async setTierValues(poolName: ContractName): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
  
    return await pool.setTierValues(
      [BigNumber.from('1000000000000000000')], [BigNumber.from('5000000000000000000')]
    );
  }
  
  async getTierValues(poolName: ContractName): Promise<void> {
    const pool = this.contracts[poolName];

    console.log(await pool.tierAmounts(0), await pool.tierAllocPoints(0));
  }

  /**
   * Withdraws token from given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async unstake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    return await pool.withdraw(poolId, amount);
  }

  /**
   * Transfers earned token reward from given pool to my account.
   */
   async harvest(poolName: ContractName, poolId: Number, sectionInUI: Number): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    //By passing 0 as the amount, we are asking the contract to only redeem the reward and not the currently staked token
    return sectionInUI !== 3
    ? await pool.withdraw(poolId, 0)
    : await pool.claim();
  }

  /**
   * Harvests and withdraws deposited tokens from the pool.
   */
  async exit(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    let userInfo = await pool.userInfo(poolId, account);
    return await pool.withdraw(poolId, userInfo.amount);
  }

  async fetchMasonryVersionOfUser(): Promise<string> {
    return 'latest';
  }

  currentMasonry(): Contract {
    if (!this.masonryVersionOfUser) {
      //throw new Error('you must unlock the wallet to continue.');
    }
    return this.contracts.Masonry;
  }

  isOldMasonryMember(): boolean {
    return this.masonryVersionOfUser !== 'latest';
  }

  async getTokenPriceFromPancakeswap(tokenContract: ERC20): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { chainId } = this.config;
    const { DAI } = this.config.externalTokens;

    const wftm = new Token(chainId, DAI[0], DAI[1], 'DAI');
    const token = new Token(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);
    try {
      const wftmToToken = await Fetcher.fetchPairData(wftm, token, this.provider);
      const priceInBUSD = new Route([wftmToToken], token);

      return priceInBUSD.midPrice.toFixed(4);
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  // async getTokenPriceFromSpiritswap(tokenContract: ERC20): Promise<string> {
  //   const ready = await this.provider.ready;
  //   if (!ready) return;
  //   const { chainId } = this.config;

  //   const { WFTM } = this.externalTokens;

  //   const wftm = new TokenSpirit(chainId, WFTM.address, WFTM.decimal);
  //   const token = new TokenSpirit(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);
  //   try {
  //     const wftmToToken = await FetcherSpirit.fetchPairData(wftm, token, this.provider);
  //     const liquidityToken = wftmToToken.liquidityToken;
  //     let ftmBalanceInLP = await WFTM.balanceOf(liquidityToken.address);
  //     let ftmAmount = Number(getFullDisplayBalance(ftmBalanceInLP, WFTM.decimal));
  //     let shibaBalanceInLP = await tokenContract.balanceOf(liquidityToken.address);
  //     let shibaAmount = Number(getFullDisplayBalance(shibaBalanceInLP, tokenContract.decimal));
  //     const priceOfOneFtmInDollars = await this.getWFTMPriceFromPancakeswap();
  //     let priceOfShiba = (ftmAmount / shibaAmount) * Number(priceOfOneFtmInDollars);
  //     return priceOfShiba.toString();
  //   } catch (err) {
  //     console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
  //   }
  // }

  async getWFTMPriceFromPancakeswap(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { WFTM, FUSDT } = this.externalTokens;
    try {
      const fusdt_wftm_lp_pair = this.externalTokens['USDT-FTM LP'];
      let ftm_amount_BN = await WFTM.balanceOf(fusdt_wftm_lp_pair.address);
      let ftm_amount = Number(getFullDisplayBalance(ftm_amount_BN, WFTM.decimal));
      let fusdt_amount_BN = await FUSDT.balanceOf(fusdt_wftm_lp_pair.address);
      let fusdt_amount = Number(getFullDisplayBalance(fusdt_amount_BN, FUSDT.decimal));
      return (fusdt_amount / ftm_amount).toString();
    } catch (err) {
      console.error(`Failed to fetch token price of WFTM: ${err}`);
    }
  }

  //===================================================================
  //===================================================================
  //===================== MASONRY METHODS =============================
  //===================================================================
  //===================================================================

  async getMasonryAPR() {
    const Masonry = this.currentMasonry();
    const latestSnapshotIndex = await Masonry.latestSnapshotIndex();
    const lastHistory = await Masonry.masonryHistory(latestSnapshotIndex);

    const lastRewardsReceived = lastHistory[1];

    const TSHAREPrice = (await this.getShareStat()).priceInDollars;
    const TOMBPrice = (await this.getTombStat()).priceInDollars;
    const epochRewardsPerShare = lastRewardsReceived / 1e18;

    //Mgod formula
    const amountOfRewardsPerDay = epochRewardsPerShare * Number(TOMBPrice) * 4;
    const masonrytShareBalanceOf = await this.TSHARE.balanceOf(Masonry.address);
    const masonryTVL = Number(getDisplayBalance(masonrytShareBalanceOf, this.TSHARE.decimal)) * Number(TSHAREPrice);
    const realAPR = ((amountOfRewardsPerDay * 100) / masonryTVL) * 365;
    return realAPR;
  }
  
  async uiAllocate(): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    return await Treasury.allocateSeigniorage();
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Masonry
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserClaimRewardFromMasonry(): Promise<boolean> {
    const Masonry = this.currentMasonry();
    return await Masonry.canClaimReward(this.myAccount);
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Masonry
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserUnstakeFromMasonry(): Promise<boolean> {
    const Masonry = this.currentMasonry();
    const canWithdraw = await Masonry.canWithdraw(this.myAccount);
    const stakedAmount = await this.getStakedSharesOnMasonry();
    const notStaked = Number(getDisplayBalance(stakedAmount, this.TSHARE.decimal)) === 0;
    const result = notStaked ? true : canWithdraw;
    return result;
  }

  async timeUntilClaimRewardFromMasonry(): Promise<BigNumber> {
    // const Masonry = this.currentMasonry();
    // const mason = await Masonry.masons(this.myAccount);
    return BigNumber.from(0);
  }

  async getTotalStakedInMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    return await Masonry.totalSupply();
  }

  async stakeShareToMasonry(amount: string): Promise<TransactionResponse> {
    if (this.isOldMasonryMember()) {
      throw new Error("you're using old masonry. please withdraw and deposit the TSHARE again.");
    }
    const Masonry = this.currentMasonry();
    return await Masonry.stake(decimalToBalance(amount));
  }

  async getStakedSharesOnMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    if (this.masonryVersionOfUser === 'v1') {
      return await Masonry.getShareOf(this.myAccount);
    }
    return await Masonry.balanceOf(this.myAccount);
  }

  async getEarningsOnMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    if (this.masonryVersionOfUser === 'v1') {
      return await Masonry.getCashEarningsOf(this.myAccount);
    }
    return await Masonry.earned(this.myAccount);
  }

  async withdrawShareFromMasonry(amount: string): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    return await Masonry.withdraw(decimalToBalance(amount));
  }

  async harvestCashFromMasonry(): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    if (this.masonryVersionOfUser === 'v1') {
      return await Masonry.claimDividends();
    }
    return await Masonry.claimReward();
  }

  async exitFromMasonry(): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    return await Masonry.exit();
  }

  async getTreasuryNextAllocationTime(): Promise<AllocationTime> {
    const { Treasury } = this.contracts;
    const nextEpochTimestamp: BigNumber = await Treasury.nextEpochPoint();
    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(Date.now());
    console.log(nextEpochTimestamp.toNumber());
    return { from: prevAllocation, to: nextAllocation };
  }
  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to claim
   * their reward from the masonry
   * @returns Promise<AllocationTime>
   */
  async getUserClaimRewardTime(): Promise<AllocationTime> {
    const { Masonry, Treasury } = this.contracts;
    const nextEpochTimestamp = await Masonry.nextEpochPoint(); //in unix timestamp
    const currentEpoch = await Masonry.epoch();
    const mason = await Masonry.masons(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const periodInHours = period / 60 / 60; // 6 hours, period is displayed in seconds which is 21600
    const rewardLockupEpochs = await Masonry.rewardLockupEpochs();
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(rewardLockupEpochs);

    const fromDate = new Date(Date.now());
    if (targetEpochForClaimUnlock - currentEpoch <= 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - currentEpoch - 1;
      const endDate = moment(toDate)
        .add(delta * periodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to unstake
   * from the masonry
   * @returns Promise<AllocationTime>
   */
  async getUserUnstakeTime(): Promise<AllocationTime> {
    const { Masonry, Treasury } = this.contracts;
    const nextEpochTimestamp = await Masonry.nextEpochPoint();
    const currentEpoch = await Masonry.epoch();
    const mason = await Masonry.masons(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const PeriodInHours = period / 60 / 60;
    const withdrawLockupEpochs = await Masonry.withdrawLockupEpochs();
    const fromDate = new Date(Date.now());
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(withdrawLockupEpochs);
    const stakedAmount = await this.getStakedSharesOnMasonry();
    if (currentEpoch <= targetEpochForClaimUnlock && Number(stakedAmount) === 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - Number(currentEpoch) - 1;
      const endDate = moment(toDate)
        .add(delta * PeriodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  async watchAssetInMetamask(assetName: string): Promise<boolean> {
    const { ethereum } = window as any;
    if (ethereum && ethereum.networkVersion === config.chainId.toString()) {
      let asset;
      let assetUrl;
      if (assetName === 'TOMB') {
        asset = this.TOMB;
        assetUrl = 'https://raw.githubusercontent.com/IceCreamFinancial/contracts-public/main/fudge.png';
      } else if (assetName === 'TSHARE') {
        asset = this.TSHARE;
        assetUrl = 'https://raw.githubusercontent.com/IceCreamFinancial/contracts-public/main/straw.png';
      } else if (assetName === 'TBOND') {
        asset = this.TBOND;
        assetUrl = 'https://raw.githubusercontent.com/IceCreamFinancial/contracts-public/main/caraml.png';
      }
      await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: asset.address,
            symbol: asset.symbol,
            decimals: 18,
            image: assetUrl,
          },
        },
      });
    }
    return true;
  }

  async provideTombFtmLP(ftmAmount: string, tombAmount: BigNumber): Promise<TransactionResponse> {
    const { TaxOffice } = this.contracts;
    let overrides = {
      value: parseUnits(ftmAmount, 18),
    };
    return await TaxOffice.addLiquidityETHTaxFree(
      tombAmount,
      tombAmount.mul(992).div(1000),
      parseUnits(ftmAmount, 18).mul(992).div(1000),
      overrides,
    );
  }

  async quoteFromSpooky(tokenAmount: string, tokenName: string): Promise<string> {
    const { SpookyRouter } = this.contracts;
    const { _reserve0, _reserve1 } = await this.TOMBWFTM_LP.getReserves();
    let quote;
    if (tokenName === 'TOMB') {
      quote = await SpookyRouter.quote(parseUnits(tokenAmount), _reserve1, _reserve0);
    } else {
      quote = await SpookyRouter.quote(parseUnits(tokenAmount), _reserve0, _reserve1);
    }
    return (quote / 1e18).toString();
  }

  getEventsLength(): number {
    return this.masonryFundEvents.length;
  }

  /**
   * @returns an array of the regulation events till the most up to date epoch
   */
   async listenForRegulationsEvents(page: number, rowsPerPage: number): Promise<any> {
    const { Treasury } = this.contracts;
    const treasuryDevFundedFilter = Treasury.filters.DevFundFunded();
    const treasuryDaoFundedFilter = Treasury.filters.DaoFundFunded();
    // const treasuryTeamFundedFilter = Treasury.filters.TeamFundFunded();
    const boughtBondsFilter = Treasury.filters.BoughtBonds();
    const redeemBondsFilter = Treasury.filters.RedeemedBonds();

    var events: any[] = [];

    let perPage = rowsPerPage;
    //At this moment we download all possible masonry fund events. For pagination we should slice array by index
    //startPageAddress is a start index of event's array.
    let startPageAddress = rowsPerPage;
    let endPageAddress = page * perPage;

    if (page > 0) startPageAddress = perPage * (page + 1);

    //Start block is always one 30460397 in masonryFundEvents
    let firstEpochBlockPerHistory = 11267135;
    let eva: Array<Event>;
    eva = [];

    let currentEpoch = Number(await this.getCurrentEpoch());
    let epochBlocksRanges: any[] = [];

    if (this.masonryFundEvents.length == 0 || currentEpoch != this.lastEpoch) {
      const treasurymasonryFundedFilter = Treasury.filters.MasonryFunded();
      this.masonryFundEvents = await Treasury.queryFilter(
        treasurymasonryFundedFilter,
        firstEpochBlockPerHistory,
        'latest',
      );
      this.lastEpoch = currentEpoch;
    }

    //Something went wrong
    if (this.masonryFundEvents.length === 0) {
      console.error('masonry fund events length = 0');
      return events;
    }

    if (this.masonryFundEvents.length < startPageAddress) {
      startPageAddress = this.masonryFundEvents.length;
    }

    eva = this.masonryFundEvents.slice(
      this.masonryFundEvents.length - startPageAddress,
      this.masonryFundEvents.length - endPageAddress,
    );

    let firstEpochTime = this.masonryFundEvents[0].args.timestamp;
    let firstBlockNum = eva[0].blockNumber;

    let lastBlockNum = 0;

    eva.forEach(function callback(value, index) {
      let currentTimeStamp = value.args.timestamp;
      let basedEpoch = 21600;

      events.push({ epoch: Math.round((currentTimeStamp - firstEpochTime) / basedEpoch) + 1 });
      // }
      events[index].masonryFund = getDisplayBalance(value.args[1]);

      if (index === 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });
      }
      if (index > 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });

        epochBlocksRanges[index - 1].endBlock = value.blockNumber;
        lastBlockNum = value.blockNumber;
      }
    });

    //Usually for the last epoch we set undefined but for other pages where the epoch is not the last we have to set the existing block number
    if (page > 0) {
      epochBlocksRanges[epochBlocksRanges.length - 1].endBlock =
        this.masonryFundEvents[this.masonryFundEvents.length - startPageAddress].blockNumber;
    }

    await Promise.all(
      epochBlocksRanges.map(async (value, index) => {
        events[index].bondsBought = await this.getBondsWithFilterForPeriod(
          boughtBondsFilter,
          value.startBlock,
          value.endBlock,
        );

        events[index].bondsRedeemed = await this.getBondsWithFilterForPeriod(
          redeemBondsFilter,
          value.startBlock,
          value.endBlock,
        );
      }),
    );

    let DEVFundEvents = await Treasury.queryFilter(treasuryDevFundedFilter, firstBlockNum, lastBlockNum);
    DEVFundEvents.forEach(function callback(value, index) {
      events[index].devFund = getDisplayBalance(value.args[1]);
    });

    let DAOFundEvents = await Treasury.queryFilter(treasuryDaoFundedFilter, firstBlockNum, lastBlockNum);
    DAOFundEvents.forEach(function callback(value, index) {
      events[index].daoFund = getDisplayBalance(value.args[1]);
    });

    // let TeamFundEvents = await Treasury.queryFilter(treasuryTeamFundedFilter, firstBlockNum, lastBlockNum);
    // TeamFundEvents.forEach(function callback(value, index) {
    //   events[index].teamFund = getDisplayBalance(value.args[1]);
    // });

    return events;
  }
  /**
   * Helper method
   * @param filter applied on the query to the treasury events
   * @param from block number
   * @param to block number
   * @returns the amount of bonds events emitted based on the filter provided during a specific period
   */
   async getBondsWithFilterForPeriod(filter: EventFilter, from: number, to: number): Promise<number> {
    let totalBondAmount = 0;
    const { Treasury } = this.contracts;
    try {
      const bondsAmount = await Treasury.queryFilter(filter, from, to);
      if (bondsAmount.length === 0) return 0;
      bondsAmount.forEach((element) => {
        let bondAmount = element.args.bondAmount;
        if (bondAmount) {
          totalBondAmount += Number(bondAmount) / 1e18;
        }
      });
    } catch (e) {
      console.log(e);
    }

    return totalBondAmount;
  }

  async zapStrategy(from: string, amount: string | BigNumber, percentFudgeLP: string | number | BigNumber, gasLimit?: BigNumber): Promise<TransactionResponse> {
    const { SuperZapper } = this.contracts;
    if (gasLimit)
      return await SuperZapper.zapStrategy(from, amount, percentFudgeLP, { gasLimit: gasLimit.toNumber() });
    else
      return await SuperZapper.zapStrategy(from, amount, percentFudgeLP);
  }

  async estimateZapIn(tokenName: string, lpName: string, amount: string): Promise<number[]> {
    const { Zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    let estimate;
    if (tokenName === AVAX_TICKER) {
      estimate = await Zapper.estimateZapIn(lpToken.address, SPOOKY_ROUTER_ADDR, parseUnits(amount, 18));
    } else {
      let token: ERC20;
      switch (tokenName) {
        case TOMB_TICKER: token = this.TOMB; break;
        case TSHARE_TICKER: token = this.TSHARE; break;
        case FTM_TICKER: token = this.FTM; break;
        default: token = null;
      }
      estimate = await Zapper.estimateZapInToken(
        token.address,
        lpToken.address,
        SPOOKY_ROUTER_ADDR,
        parseUnits(amount, 18),
      );
    }
    return [estimate[0] / 1e18, estimate[1] / 1e18];
  }
  async zapIn(tokenName: string, lpName: string, amount: string, slippageBp: string): Promise<TransactionResponse> {
    const { Zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    if (tokenName === AVAX_TICKER) {
      let overrides = {
        value: parseUnits(amount, 18),
        gasLimit: '1500000'
      };
      return await Zapper.zapAVAXToLP(lpToken.address, overrides);

    } else {
      let token: ERC20;
      switch (tokenName) {
        case TOMB_TICKER: token = this.TOMB; break;
        case TSHARE_TICKER: token = this.TSHARE; break;
        case FTM_TICKER: token = this.FTM; break;
        default: token = null;
      }

      return await Zapper.zapTokenToLP(
        token.address,
        parseUnits(amount, 18),
        lpToken.address,
        { gasLimit: '1500000' }
      );
    }
  }
  async swapTBondToTShare(tbondAmount: BigNumber): Promise<TransactionResponse> {
    const { TShareSwapper } = this.contracts;
    return await TShareSwapper.swapTBondToTShare(tbondAmount);
  }
  async estimateAmountOfTShare(tbondAmount: string): Promise<string> {
    const { TShareSwapper } = this.contracts;
    try {
      const estimateBN = await TShareSwapper.estimateAmountOfTShare(parseUnits(tbondAmount, 18));
      return getDisplayBalance(estimateBN, 18, 6);
    } catch (err) {
      console.error(`Failed to fetch estimate tshare amount: ${err}`);
    }
  }

  async getTShareSwapperStat(address: string): Promise<TShareSwapperStat> {
    const { TShareSwapper } = this.contracts;
    const tshareBalanceBN = await TShareSwapper.getTShareBalance();
    const tbondBalanceBN = await TShareSwapper.getTBondBalance(address);
    // const tombPriceBN = await TShareSwapper.getTombPrice();
    // const tsharePriceBN = await TShareSwapper.getTSharePrice();
    const rateTSharePerTombBN = await TShareSwapper.getTShareAmountPerTomb();
    const tshareBalance = getDisplayBalance(tshareBalanceBN, 18, 5);
    const tbondBalance = getDisplayBalance(tbondBalanceBN, 18, 5);
    return {
      tshareBalance: tshareBalance.toString(),
      tbondBalance: tbondBalance.toString(),
      // tombPrice: tombPriceBN.toString(),
      // tsharePrice: tsharePriceBN.toString(),
      rateTSharePerTomb: rateTSharePerTombBN.toString(),
    };
  }
}
