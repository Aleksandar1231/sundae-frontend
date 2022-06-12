import { BigNumber } from 'ethers';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import { Bank } from '../tomb-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useZap = (bank: Bank) => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleZap = useCallback(
    (zappingToken: string, tokenName: string, amount: string, slippageBp: string) => {
      handleTransactionReceipt(
        tombFinance.zapIn(zappingToken, tokenName, amount, slippageBp),
        `Zap ${amount} in ${bank.depositTokenName}.`,
      );
    },
    [bank, tombFinance, handleTransactionReceipt],
  );

  async function handleZapIn(
    zappingToken: string,
    tokenName: string,
    amount: string,
    slippageBp: string,
    startBalance: BigNumber,
    onDeposit: ((amount: string) => void) | ((amount: string) => Promise<any>)
  ) {
    const zapTx = await tombFinance.zapIn(zappingToken, tokenName, amount, slippageBp);
    await zapTx.wait();
    const afterBalance = await tombFinance.externalTokens[tokenName].balanceOf(tombFinance.myAccount);
    return await onDeposit(new BigNumberJS(afterBalance.sub(startBalance).toString()).div(new BigNumberJS(10).pow(18)).toFixed());
  }

  return { onZap: handleZap, onZapIn: handleZapIn };
};

export default useZap;
