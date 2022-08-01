import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import useTombFinance from './useTombFinance';
import useApprove from './useApprove';
import { addTransaction } from '../state/transactions/actions';
import useBank from './useBank';

const APPROVE_AMOUNT = ethers.constants.MaxUint256;
const APPROVE_BASE_AMOUNT = BigNumber.from('1000000000000000000000000');

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
function useApproveStrategy(): [ApprovalState, () => Promise<void>] {
  const tombFinance = useTombFinance();
  const { StrawRewardPool, SuperZapper, Masonry } = tombFinance.contracts;
  const bankFudgeLP = useBank('FudgeDaiLPTShareRewardPool');
  const bankStrawLP = useBank('StrawDaiLPTShareRewardPool');
  const [approveStatusStrategy, approveStrategy] = useApprove(tombFinance.TOMB, SuperZapper.address);
  const [approveStatusStrategy2, approveStrategy2] = useApprove(tombFinance.TSHARE, SuperZapper.address);
  const [approveStatusMasonry, approveMasonry] = useApprove(tombFinance.TSHARE, Masonry.address);
  const [approveStatusFudgePair, approveFudgePair] = useApprove(bankFudgeLP.depositToken, StrawRewardPool.address);
  const [approveStatusStrawPair, approveStrawPair] = useApprove(bankStrawLP.depositToken, StrawRewardPool.address);

  const approvalState: ApprovalState = useMemo(() => {
    return approveStatusStrategy === ApprovalState.APPROVED && approveStatusStrategy2 === ApprovalState.APPROVED && approveStatusMasonry === ApprovalState.APPROVED && approveStatusFudgePair === ApprovalState.APPROVED && approveStatusStrawPair === ApprovalState.APPROVED
     ? ApprovalState.APPROVED
     : ApprovalState.NOT_APPROVED;
  }, [approveStatusStrategy, approveStatusStrategy2, approveStatusMasonry, approveStatusFudgePair, approveStatusStrawPair]);

  const approve = useCallback(async (): Promise<void> => {
    if (
      approveStatusStrategy !== ApprovalState.NOT_APPROVED &&
      approveStatusStrategy2 !== ApprovalState.NOT_APPROVED &&
      approveStatusMasonry !== ApprovalState.NOT_APPROVED &&
      approveStatusFudgePair !== ApprovalState.NOT_APPROVED &&
      approveStatusStrawPair !== ApprovalState.NOT_APPROVED
    ) {
      console.error('approve was called unnecessarily');
      return;
    }

    if (approveStatusStrategy !== ApprovalState.APPROVED)
      await approveStrategy();
    if (approveStatusStrategy2 !== ApprovalState.APPROVED)
      await approveStrategy2();
    if (approveStatusMasonry !== ApprovalState.APPROVED)
      await approveMasonry();
    if (approveStatusFudgePair !== ApprovalState.APPROVED)
      await approveFudgePair();
    if (approveStatusStrawPair !== ApprovalState.APPROVED)
      await approveStrawPair();
  }, [approveStatusStrategy, approveStatusStrategy2, approveStatusMasonry, approveStatusFudgePair, approveStatusStrawPair]);

  return [approvalState, approve];
}

export default useApproveStrategy;
