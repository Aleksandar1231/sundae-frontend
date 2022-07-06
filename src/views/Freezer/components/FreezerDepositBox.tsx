import React from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { ProfitDistributionInfo } from '../../../tomb-finance';
import useModal from '../../../hooks/useModal';
import StakeModal from './StakeModal';
import useProfDistStake from '../../../hooks/Freezer/useProfDistStake';
import useExternalTokenBalanceByName from '../../../hooks/useExternalTokenBalanceByName';

interface FreezerStatusBoxProps {
  stakedAmount: number;
  depositAmountInDollars: number;
  profitDistributionInfo: ProfitDistributionInfo;
  isDataLoaded: boolean;
  depositFee?: number;
}

const FreezerDepositBox: React.FC<FreezerStatusBoxProps> = ({
  stakedAmount,
  depositAmountInDollars,
  profitDistributionInfo,
  isDataLoaded,
  depositFee = 0,
}) => {
  const { onStake } = useProfDistStake(profitDistributionInfo.contract, profitDistributionInfo.depositTokenName);
  const depositTokenBalance = useExternalTokenBalanceByName(profitDistributionInfo.depositTokenName);

  const [onPresentStake, onDismissStake] = useModal(
    <StakeModal
      max={depositTokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissStake();
      }}
      tokenName={profitDistributionInfo.depositTokenName}
    />,
  );

  return (
    <Box
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'space-between'}
      display={'flex'}
      style={{
        height: '100%',
      }}
    >
      <Box mt={2} display={'flex'} flexDirection={'column'} justifyContent={'space-between'} gridGap={'0.5rem'}>
        <Typography color={'primary'} variant={'h3'}>
          Deposited
        </Typography>
        <Typography color={'primary'} variant={'h2'}>
          {stakedAmount?.toFixed(2) ?? '0.00'}
        </Typography>
        <Typography color={'primary'} variant={'h4'}>
          ${depositAmountInDollars?.toFixed(2) ?? '0.00'}
        </Typography>
      </Box>
      <Box
        mt={2}
        mb={2}
        flexDirection={'column'}
        display={'flex'}
        style={{
          width: '80%',
          maxWidth: '180px',
        }}
      >
        <Button
          style={{ marginTop: '10px', marginBottom: '10px' }}
          color="secondary"
          variant="contained"
          size="small"
          target="_blank"
          href={isDataLoaded ? profitDistributionInfo.depositTokenSource : ''}
          disabled={!isDataLoaded || profitDistributionInfo.closeForStaking || profitDistributionInfo.close}
        >
          {profitDistributionInfo.depositTokenButtonTitle}
        </Button>
        <Button
          disabled={!isDataLoaded || profitDistributionInfo.closeForStaking || profitDistributionInfo.close}
          color="secondary"
          variant="contained"
          size="small"
          onClick={onPresentStake}
        >
          Deposit ({depositFee ? depositFee : '-.-'}% FEE)
        </Button>
      </Box>
    </Box>
  );
};

export default FreezerDepositBox;
