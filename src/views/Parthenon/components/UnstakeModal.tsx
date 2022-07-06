import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {Button, CircularProgress, Typography, useMediaQuery, withStyles} from '@material-ui/core';
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';
import styled from 'styled-components';
import { ApprovalState } from '../../../hooks/useApproveBasedTombZapper';
import Spacer from '../../../components/Spacer';
import { BigNumber, ethers } from 'ethers';

import { getFullDisplayBalance } from '../../../utils/formatBalance';
import useApproveParthenonTokens from '../../../hooks/useApproveParthenonTokens';
import CloseIcon from "@material-ui/icons/Close";
import {useTheme} from "@material-ui/core/styles";

declare let window: any;

interface ZapProps extends ModalProps {
  max: BigNumber;
  onConfirm: (amount: string) => void;
  tokenName?: string;
}

const UnstakeModal: React.FC<ZapProps> = ({ onConfirm, onDismiss, max, tokenName = '' }) => {
  const [val, setVal] = useState('');

  /**
   * Checks if a value is a valid number or not
   * @param n is the value to be evaluated for a number
   * @returns
   */
  function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  const theme = useTheme();
  const isSmallSizeScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max);
  }, [max]);

  const handleChange = async (e: any) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setVal(e.currentTarget.value);
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setVal(e.currentTarget.value);
  };

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  const [parthenonToken, setParthenonToken] = useState(tokenName);
  const [approveParthenonStatus, approveParthenon] = useApproveParthenonTokens(parthenonToken);
  const [modalApprovalState, setModalApprovalState] = useState(ApprovalState.UNKNOWN);

  useEffect(() => {
    if (modalApprovalState === ApprovalState.PENDING && approveParthenonStatus === ApprovalState.NOT_APPROVED) {
      setModalApprovalState(ApprovalState.APPROVED);
    } else {
      setModalApprovalState(approveParthenonStatus);
    }
  }, [approveParthenonStatus, parthenonToken]);

  return (
    <Modal>
      <StyledCloseIcon
          onClick={onDismiss}
      />
      <Spacer size={isSmallSizeScreen ? 'md' : 'none'}/>
      <Typography variant={'h4'} color={'primary'}>{'Withdraw ' + tokenName}</Typography>
      <StyledActionSpacer />
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
      />
      <Spacer />
      <ModalActions>
        {modalApprovalState &&
          (() => {
            if (modalApprovalState === ApprovalState.PENDING) {
              return <CircularProgress />;
            }
            if (modalApprovalState === ApprovalState.APPROVED) {
              return (
                <Button color="secondary" variant="contained" onClick={() => onConfirm(val)}>
                  Withdraw
                </Button>
              );
            } else {
              return (
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    approveParthenon();
                  }}
                >
                  Approve {tokenName}
                </Button>
              );
            }
          })()}
      </ModalActions>
    </Modal>
  );
};

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCloseIcon = withStyles({
  root: {
    position: 'absolute',
    right: '5px',
    top: '5px',
    padding: '10px',
    cursor: 'pointer',
    transition: '0.3s ease-in-out',
    color: '#fff',
    '&:hover': {
      color: '#a97c50',
      transition: '0.3s ease-in-out'
    }
  },
})(CloseIcon);

export default UnstakeModal;
