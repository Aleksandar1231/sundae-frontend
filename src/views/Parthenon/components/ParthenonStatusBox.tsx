import React from 'react';
import { Box, Typography, useMediaQuery } from '@material-ui/core';
import CountUp from 'react-countup';
import TokenSymbol from '../../../components/TokenSymbol';
import { useTheme } from '@material-ui/core/styles';

interface ParthenonStatusBoxProps {
  totalValueLocked: number;
  depositTokenName: string;
  activeRewards: number;
  totalRewardsInDollars: number;
  allTokenAmountBurnedInDollars: number;
}

const ParthenonStatusBox: React.FC<ParthenonStatusBoxProps> = ({
  totalValueLocked = 0,
  depositTokenName,
  activeRewards = 0,
  totalRewardsInDollars = 0,
  allTokenAmountBurnedInDollars = 0,
}) => {
  const theme = useTheme();
  const isSmallSizeScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const isSemiMidSizeScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ marginTop: '10px', marginBottom: '10px' }}>
      <Typography color={'primary'} variant={'h4'}>
        TVL: &nbsp;
        <CountUp end={totalValueLocked ?? 0} separator="," prefix="$" />
      </Typography>
      <TokenSymbol size={110} symbol={depositTokenName} />
      <Typography color={'primary'} variant={'h5'}>
        Active rewards | ${activeRewards?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      </Typography>
      <Typography color={'primary'} variant={'h5'}>
        Distributed Rewards | ${totalRewardsInDollars?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      </Typography>
      <Typography color={'primary'} variant={'h5'}>
        Burned | ${allTokenAmountBurnedInDollars?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      </Typography>
      <div
        hidden={!isSemiMidSizeScreen && !isSmallSizeScreen}
        style={{ border: '0.1px solid white', marginTop: '20px' }}
      ></div>
    </Box>
  );
};

export default ParthenonStatusBox;
