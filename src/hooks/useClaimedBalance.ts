import { useEffect, useState, useMemo } from 'react';

import {BigNumber} from 'ethers';
import useTombFinance from './useTombFinance';
import {ContractName} from '../tomb-finance';

const useClaimedBalance = (poolName: ContractName, sectionInUI: Number, account: string) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const tombFinance = useTombFinance();

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await tombFinance.claimedBalanceNode(poolName, account) 
      setBalance(res)
    }

    if (account && sectionInUI === 3 && tombFinance && poolName) {
      fetchBalance();
    }
  }, [account, poolName, setBalance, tombFinance, sectionInUI]);

  return balance;
};

export default useClaimedBalance;