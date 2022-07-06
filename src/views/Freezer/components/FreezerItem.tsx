import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@material-ui/core';

import { ProfitDistributionInfo } from '../../../tomb-finance';

import { useWallet } from 'use-wallet';

import useProfitDistributionStat from '../../../hooks/Freezer/useProfitDistributionStat';
import useProfitDistributionClaim from '../../../hooks/Freezer/useProfitDistributionClaim';
import useFreezerPoolStat from '../../../hooks/Freezer/useFreezerPoolStat';
import useFreezerPoolRewardStat from '../../../hooks/Freezer/useFreezerPoolRewardStat';
import useFreezerDepositFee from '../../../hooks/Freezer/useFreezerDepositFee';

import FreezerStatusBox from './FreezerStatusBox';
import FreezerDepositBox from './FreezerDepositBox';
import FreezerWithdrawBox from './FreezerWithdrawBox';
import FreezerRewardsBox from './FreezerRewardsBox';

interface FreezerItemProps {
  profitDistribution: ProfitDistributionInfo;
}

const FreezerItem: React.FC<FreezerItemProps> = ({ profitDistribution }) => {
  const { account } = useWallet();

  const profitDistributionStat = useProfitDistributionStat(profitDistribution, account);
  const parthenonPoolStat = useFreezerPoolStat(profitDistributionStat, profitDistribution);
  const parthenonPoolRewardStat = useFreezerPoolRewardStat(profitDistribution, account);
  const depositFee = useFreezerDepositFee(profitDistributionStat);
  const { onRewardClaim } = useProfitDistributionClaim(profitDistribution.contract);

  const [isDataLoaded, setDataLoaded] = useState(false); //Disable buttons while data loading

  const fetchData = async (): Promise<void> => {
    if (account && profitDistributionStat && parthenonPoolStat) {
      setDataLoaded(true);
    }
  };

  useEffect(() => {
    fetchData().then();
  }, [account, profitDistributionStat, parthenonPoolStat]);

  return (
    <Grid item={true} xs={12}>
      <Container
        style={{
          minHeight: '80px',
          display: 'flex',
          textAlign: 'center',
          backgroundColor: 'rgba(46, 15, 3, 0.75)',
          borderRadius: '20px',
          border: '1px solid #DAC0AA',
        }}
      >
        <Grid container>
          <Grid item xs={12} md={3}>
            <FreezerStatusBox
              totalValueLocked={parthenonPoolStat?.totalValueLocked}
              depositTokenName={profitDistribution?.depositTokenName}
              activeRewards={parthenonPoolRewardStat?.activeRewards}
              totalRewardsInDollars={parthenonPoolRewardStat?.totalRewardsInDollars}
              allTokenAmountBurnedInDollars={parthenonPoolStat?.allTokenAmountBurnedInDollars}
            ></FreezerStatusBox>
          </Grid>
          <Grid item xs={12} md={3}>
            <FreezerDepositBox
              stakedAmount={parthenonPoolStat?.stakedAmount}
              depositAmountInDollars={parthenonPoolStat?.depositAmountInDollars}
              profitDistributionInfo={profitDistribution}
              isDataLoaded={isDataLoaded}
              depositFee={depositFee}
            ></FreezerDepositBox>
          </Grid>
          <Grid item xs={12} md={3}>
            <FreezerWithdrawBox
              profitDistributionInfo={profitDistribution}
              isDataLoaded={isDataLoaded}
              profitDistributionStat={profitDistributionStat}
            ></FreezerWithdrawBox>
          </Grid>
          <Grid item xs={12} md={3}>
            <FreezerRewardsBox
              rewards={parthenonPoolRewardStat?.earnedRewards}
              rewardPricesInDollars={parthenonPoolRewardStat?.rewardPricesInDollars}
              profitDistributionInfo={profitDistribution}
              isDataLoaded={isDataLoaded}
              onClaim={onRewardClaim}
            ></FreezerRewardsBox>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
};

export default FreezerItem;
