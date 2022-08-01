import { BigNumber } from 'ethers';
import { TSHARE_TICKER } from './../utils/constants';
import { useCallback } from 'react';
import useTombFinance from './useTombFinance';

const useStrategy = () => {
  const tombFinance = useTombFinance();
  const ZERO = BigNumber.from('0');

  const handleStrategy = useCallback(async (percentFudgeLP: number = 80, stakeBoardroom: number = 20) => {
    if (!tombFinance.myAccount) return;
    const harvestTxs = [];

    if ((await tombFinance.canUserClaimRewardFromMasonry()) && (await tombFinance.getEarningsOnMasonry()).gt(ZERO))
      harvestTxs.push(await tombFinance.harvestCashFromMasonry());
    if ((await tombFinance.earnedFromBank('StrawDaiLPTShareRewardPool', TSHARE_TICKER, 0, tombFinance.myAccount)).gt(ZERO))
      harvestTxs.push(await tombFinance.harvest('StrawDaiLPTShareRewardPool', 7, 2));
    if ((await tombFinance.earnedFromBank('FudgeDaiLPTShareRewardPool', TSHARE_TICKER, 0, tombFinance.myAccount)).gt(ZERO))
      harvestTxs.push(await tombFinance.harvest('FudgeDaiLPTShareRewardPool', 0, 2));

    await Promise.all(harvestTxs.map((tx) => tx.wait()));
    let shareBoardroomAmount = ZERO;
    const zapsCompleted: boolean[] = [];

    for (let retries = 0; retries < 3; retries++) {

      const [fudgeBalance, shareBalance] = await Promise.all([
        tombFinance.TOMB.balanceOf(tombFinance.myAccount),
        tombFinance.TSHARE.balanceOf(tombFinance.myAccount)
      ]);
      const shareCompoundAmount = stakeBoardroom > 0 ? shareBalance.mul(100 - stakeBoardroom).div(100) : shareBalance;
      shareBoardroomAmount = stakeBoardroom > 0 && !zapsCompleted[1] ? shareBalance.sub(shareCompoundAmount) : ZERO;

      const zapTxs = [];
      let txIndex = 0;

      if (fudgeBalance.gt(BigNumber.from('2000000000000000000')) && !zapsCompleted[0])
        zapTxs.push(await tombFinance.zapStrategy(tombFinance.TOMB.address, fudgeBalance, percentFudgeLP, BigNumber.from('1500000').mul(retries + 1)));
      if (shareCompoundAmount.gt(BigNumber.from('500000000000000')) && !zapsCompleted[1])
        zapTxs.push(await tombFinance.zapStrategy(tombFinance.TSHARE.address, shareCompoundAmount, percentFudgeLP, BigNumber.from('1500000').mul(retries + 1)));

      try {
        for (; txIndex < zapTxs.length; txIndex++) {
          zapsCompleted[txIndex] = false;
          const receipt = await zapTxs[txIndex].wait();
          zapsCompleted[txIndex] = receipt.status > 0;
        }
        break;
      } catch (e) { 
        console.error(e);
        zapsCompleted[txIndex] = false;
      }
    }

    const [balanceFUDGELP, balanceSHARELP] = await Promise.all([
      tombFinance.externalTokens['FUDGE-DAI LP'].balanceOf(tombFinance.myAccount),
      tombFinance.externalTokens['STRAW-DAI LP'].balanceOf(tombFinance.myAccount)
    ]);

    const stakeTxs = [];

    if (balanceFUDGELP.gt(ZERO))
      stakeTxs.push(await tombFinance.stake('FudgeDaiLPTShareRewardPool', 0, 2, balanceFUDGELP));
    if (balanceSHARELP.gt(ZERO))
      stakeTxs.push(await tombFinance.stake('StrawDaiLPTShareRewardPool', 7, 2, balanceSHARELP));
    if (stakeBoardroom > 0 && shareBoardroomAmount.gt(ZERO))
      stakeTxs.push(await tombFinance.currentMasonry().stake(shareBoardroomAmount));

    await Promise.all(stakeTxs.map((tx) => tx.wait()));

  }, [tombFinance, ZERO]);
  return { onStrategy: handleStrategy };
};

export default useStrategy;
