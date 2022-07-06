import { useCallback } from 'react';
import useFreezer from '../useFreezer';
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';

const useProfDistWithdraw = (profitDistributionName: string, depositTokenName: string) => {
  const Freezer = useFreezer();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
          Freezer.profDistWithdraw(profitDistributionName, amount),
        `Withdraw ${amount} ${depositTokenName} from Profit Distribution`,
      );
    },
    [Freezer, handleTransactionReceipt],
  );
  return { onWithdraw: handleWithdraw };
};

export default useProfDistWithdraw;
