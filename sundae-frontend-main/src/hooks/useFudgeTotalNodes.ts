import { BigNumber } from 'ethers';
import { useCallback, useState, useEffect } from 'react';
import useTombFinance from './useTombFinance';
import config from '../config';

const useFudgeTotalNodes = () => {
  const tombFinance = useTombFinance();

  const [poolAPRs, setPoolAPRs] = useState<BigNumber[]>([]);

  const fetchNodes = useCallback(async () => {
    setPoolAPRs(await tombFinance.getFudgeNodes());
  }, [tombFinance]);

  useEffect(() => {
    
      fetchNodes().catch((err) => console.error(`Failed to fetch APR info: ${err.stack}`));
      const refreshInterval = setInterval(fetchNodes, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    
  }, [setPoolAPRs, tombFinance, fetchNodes]);

  return poolAPRs;
};

export default useFudgeTotalNodes;