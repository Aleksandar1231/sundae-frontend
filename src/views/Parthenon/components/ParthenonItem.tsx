import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@material-ui/core';

import { ProfitDistributionInfo } from '../../../tomb-finance';

import { useWallet } from 'use-wallet';

import useProfitDistributionStat from '../../../hooks/parthenon/useProfitDistributionStat';
import useProfitDistributionClaim from '../../../hooks/parthenon/useProfitDistributionClaim';
import useParthenonPoolStat from '../../../hooks/parthenon/useParthenonPoolStat';
import useParthenonPoolRewardStat from '../../../hooks/parthenon/useParthenonPoolRewardStat';
import useParthenonDepositFee from '../../../hooks/parthenon/useParthenonDepositFee';

import ParthenonStatusBox from './ParthenonStatusBox';
import ParthenonDepositBox from './ParthenonDepositBox';
import ParthenonWithdrawBox from './ParthenonWithdrawBox';
import ParthenonRewardsBox from './ParthenonRewardsBox';

interface ParthenonItemProps {
  profitDistribution: ProfitDistributionInfo;
}

const ParthenonItem: React.FC<ParthenonItemProps> = ({ profitDistribution }) => {
  const { account } = useWallet();

  const profitDistributionStat = useProfitDistributionStat(profitDistribution, account);
  const parthenonPoolStat = useParthenonPoolStat(profitDistributionStat, profitDistribution);
  const parthenonPoolRewardStat = useParthenonPoolRewardStat(profitDistribution, account);
  const depositFee = useParthenonDepositFee(profitDistributionStat);
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
            <ParthenonStatusBox
              totalValueLocked={parthenonPoolStat?.totalValueLocked}
              depositTokenName={profitDistribution?.depositTokenName}
              activeRewards={parthenonPoolRewardStat?.activeRewards}
              totalRewardsInDollars={parthenonPoolRewardStat?.totalRewardsInDollars}
              allTokenAmountBurnedInDollars={parthenonPoolStat?.allTokenAmountBurnedInDollars}
            ></ParthenonStatusBox>
          </Grid>
          <Grid item xs={12} md={3}>
            <ParthenonDepositBox
              stakedAmount={parthenonPoolStat?.stakedAmount}
              depositAmountInDollars={parthenonPoolStat?.depositAmountInDollars}
              profitDistributionInfo={profitDistribution}
              isDataLoaded={isDataLoaded}
              depositFee={depositFee}
            ></ParthenonDepositBox>
          </Grid>
          <Grid item xs={12} md={3}>
            <ParthenonWithdrawBox
              profitDistributionInfo={profitDistribution}
              isDataLoaded={isDataLoaded}
              profitDistributionStat={profitDistributionStat}
            ></ParthenonWithdrawBox>
          </Grid>
          <Grid item xs={12} md={3}>
            <ParthenonRewardsBox
              rewards={parthenonPoolRewardStat?.earnedRewards}
              rewardPricesInDollars={parthenonPoolRewardStat?.rewardPricesInDollars}
              profitDistributionInfo={profitDistribution}
              isDataLoaded={isDataLoaded}
              onClaim={onRewardClaim}
            ></ParthenonRewardsBox>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
};

export default ParthenonItem;
