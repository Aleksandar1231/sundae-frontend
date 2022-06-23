import React, { useCallback, useMemo, useState } from 'react';

import { Button } from '@material-ui/core';
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';

import { getFullDisplayBalance } from '../../../utils/formatBalance';
import { BigNumber } from 'ethers';

interface DepositModalProps extends ModalProps {
  max: BigNumber;
  decimals: number;
  onConfirm: (amount: string) => void;
  tokenName?: string;
}

const DepositModal: React.FC<DepositModalProps> = ({ max, decimals, onConfirm, onDismiss, tokenName = '' }) => {
  const [val, setVal] = useState('');

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, decimals, false);
  }, [max, decimals]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value);
    },
    [setVal],
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  return (
    <Modal>
<<<<<<< HEAD
      <ReactTooltip effect="solid" clickable type="dark" place="bottom" />
      <ModalTitle text={bank.sectionInUI !== 3 ? `Deposit ${tokenName}` : `Purchase ${getNodeText(bank.poolId)}s Node`} />
      {bank.sectionInUI !== 3 ? <><TokenInput
=======
      <ModalTitle text={`Deposit ${tokenName}`} />
      <TokenInput
>>>>>>> main
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
<<<<<<< HEAD
        <ModalActions>
          <Button color="primary" variant="contained" onClick={() => onConfirm(val)}>
            Confirm
          </Button>
        </ModalActions></>
        :
        <div style={{ display: 'flex' }}>
          {numNodes.map((num, i) => {
            return (<>
              <Button data-tip={`${getDisplayBalance(nodePrice.mul(num), 18, 0)} FUDGE`} style={{ whiteSpace: 'nowrap', marginRight: i === numNodes.length - 1 ? '0' : '1rem' }} className="shinyButtonSecondary" onClick={() => onConfirm(num.toString())}>
                {num} {getNodeText(bank.poolId).split(' ')[0]}
              </Button>
            </>
            );
          })}
        </div>
      }
=======
      <ModalActions>
        {/* <Button color="secondary" variant="outlined" onClick={onDismiss}>Cancel</Button> */}
        <Button color="primary" variant="contained" onClick={() => onConfirm(val)}>
          Confirm
        </Button>
      </ModalActions>
>>>>>>> main
    </Modal>
  );
};

export default DepositModal;
