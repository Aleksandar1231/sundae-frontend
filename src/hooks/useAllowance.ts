import { useCallback, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { BigNumber } from 'ethers';
import ERC20 from '../tomb-finance/ERC20';

const useAllowance = (token: ERC20, spender: string, pendingApproval?: boolean) => {
  const [allowance, setAllowance] = useState<BigNumber>(null);
  const { account } = useWallet();

  const fetchAllowance = useCallback(async () => {
    const allowance = await token.allowance(account, spender);
    setAllowance(allowance);
  }, [account, spender, token]);

  useEffect(() => {
    if (account && spender && token) {
      fetchAllowance().catch((err) => console.error(`Failed to fetch allowance: ${err.stack}`));
    }
  }, [account, spender, token, pendingApproval, fetchAllowance]);

  return allowance;
};

// Retrieve lottery allowance
export const useLotteryAllowance = () => {
  const [allowance, setAllowance] = useState(BigNumber.from(0))
  const { account } = useWeb3React()
  const lydContract = useLyd()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchAllowance = async () => {
      const res = await lydContract.methods.allowance(account, getLotteryAddress()).call()
      setAllowance(BigNumber.from(res))
    }

    if (account) {
      fetchAllowance()
    }
  }, [account, lydContract, fastRefresh])

  return allowance
}


export default useAllowance;
