import { useCallback } from 'react';
import useFreezer from '../useFreezer';
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';

const useProfDistStake = (profitDistributionName: string, depositTokenName: string) => {
  const Freezer = useFreezer();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        Freezer.profDistStake(profitDistributionName, amount),
        `Stake ${amount} ${depositTokenName} to Profit Distribution`,
      );
    },
    [Freezer, handleTransactionReceipt],
  );
  return { onStake: handleStake };
};

export default useProfDistStake;
