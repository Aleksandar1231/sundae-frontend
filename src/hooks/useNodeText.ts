import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import { Bank } from '../tomb-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';

const useNodeText = () => {

  const getNodeText = (nodeId: number) => {
    switch (nodeId) {
      case 0: return 'Single Scoop';
      case 1: return 'Double Scoop';
      case 2: return 'Triple Scoop';
/*       case 3: return 'Mega Node';
      case 4: return 'Giga Node'; */
        default: return '';
    }
  }

  return { getNodeText }
};

export default useNodeText;