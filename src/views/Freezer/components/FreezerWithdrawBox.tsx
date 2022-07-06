import React, { useEffect, useState } from 'react';
import { Button, Typography, Box } from '@material-ui/core';

import { ProfitDistributionInfo } from '../../../tomb-finance';
import { ProfitDistributionStat } from '../../../tomb-finance/types';

import Spacer from '../../../components/Spacer';
import IOSSlider from '../../../components/IOSSlider/IOSSlider';

import useModal from '../../../hooks/useModal';
import useProfDistWithdraw from '../../../hooks/Freezer/useProfDistWithdraw';

import UnstakeModal from './UnstakeModal';
import useFreezerCalculateUserTax from '../../../hooks/Freezer/useFreezerCalculateUserTax';

interface FreezerWithdrawBoxProps {
  profitDistributionInfo: ProfitDistributionInfo;
  isDataLoaded: boolean;
  profitDistributionStat: ProfitDistributionStat;
}

const FreezerWithdrawBox: React.FC<FreezerWithdrawBoxProps> = ({
  profitDistributionInfo,
  isDataLoaded,
  profitDistributionStat,
}) => {
  const { onWithdraw } = useProfDistWithdraw(profitDistributionInfo.contract, profitDistributionInfo.depositTokenName);
  const userCurrentTax = useFreezerCalculateUserTax(profitDistributionStat);
  const marks = [
    {
      value: -7,
    },
    {
      value: 0,
    },
  ];

  const [onPresentUnstake, onDismissUnstake] = useModal(
    <UnstakeModal
      max={profitDistributionStat?.balance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissUnstake();
      }}
      tokenName={profitDistributionInfo.depositTokenName}
    />,
  );

  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      flexDirection={'column'}
      alignItems={'center'}
      style={{ height: '100%' }}
    >
      <Box mt={2}>
        <Typography color={'primary'} variant={'h4'}>
          Decaying Withdrawal Tax
        </Typography>
        <Spacer></Spacer>
        <IOSSlider
          style={{ width: '85%' }}
          key={`slider-${userCurrentTax ? userCurrentTax : '-.-'}`}
          aria-label="ios slider"
          value={Math.abs(Number(userCurrentTax ? userCurrentTax : 0)) * -1}
          min={-7}
          max={0}
          step={0.01}
          marks={marks}
          valueLabelDisplay="on"
        />
      </Box>
      <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} gridGap={'0.3rem'}>
        <Typography color={'primary'} variant={'h4'}>
          From {profitDistributionInfo.taxMaxPercent}% to {profitDistributionInfo.taxMinPercent}%
        </Typography>
        <Typography color={'primary'} variant={'h6'}>
          Withdraw tax will decrease over 7 days
        </Typography>
      </Box>
      <Box mb={2} mt={2}>
        <Button
          disabled={!isDataLoaded || profitDistributionInfo.close}
          color="secondary"
          variant="contained"
          size="small"
          onClick={onPresentUnstake}
        >
          Withdraw
        </Button>
      </Box>
    </Box>
  );
};

export default FreezerWithdrawBox;
