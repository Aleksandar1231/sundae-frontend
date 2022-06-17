import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import { Bank } from '../tomb-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';

const useNodeText = () => {

  const getNodeText = (nodeId: number) => {
    switch (nodeId) {
      case 0: return 'Node';
      case 1: return 'Double Scoop';
      case 2: return 'Triple Scoop';
      case 3: return 'Quad Scoop';
      case 4: return 'Sundae';
        default: return 'Node';
    }
  }

  return { getNodeText }
};

export default useNodeText;