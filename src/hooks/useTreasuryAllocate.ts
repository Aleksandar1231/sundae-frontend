import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useTreasuryAllocate = (description?: string) => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleAllocate = useCallback(() => {
      const alertDesc = description || 'Allocate Seigniorage'
    handleTransactionReceipt(tombFinance.uiAllocate(), alertDesc);
  }, [tombFinance, description, handleTransactionReceipt]);

  return { onAllocate: handleAllocate };
};

export default useTreasuryAllocate;
