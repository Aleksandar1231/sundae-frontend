import { useCallback, useEffect, useState, useMemo } from 'react';

import { BigNumber } from 'ethers';
import useTombFinance from './useTombFinance';
import { ContractName } from '../tomb-finance';
import config from '../config';

const useStakedBalance = (poolName: ContractName, poolId: Number, sectionInUI: Number, account: string) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const tombFinance = useTombFinance();
  const fetchBalance = useCallback(async () => {
    const balance = await tombFinance.stakedBalanceOnBank(poolName, poolId, tombFinance.myAccount);

    setBalance(balance);
  }, [poolName, poolId, sectionInUI, account, tombFinance]);

  useEffect(() => {

      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    
  }, [account, poolName, tombFinance, sectionInUI, fetchBalance]);

  return balance;
};

export default useStakedBalance;
