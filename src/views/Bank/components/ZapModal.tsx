import React, { useState, useMemo, useEffect } from 'react';

import { Button, Select, MenuItem, InputLabel, withStyles, Input } from '@material-ui/core';
// import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';
import styled from 'styled-components';

import { getDisplayBalance } from '../../../utils/formatBalance';
import Label from '../../../components/Label';
import useLpStats from '../../../hooks/useLpStats';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useTombFinance from '../../../hooks/useTombFinance';
import { useWallet } from 'use-wallet';
import useApproveZapper, { ApprovalState } from '../../../hooks/useApproveZapper';
import { TOMB_TICKER, TSHARE_TICKER, WFTM_TICKER, FTM_TICKER, AVAX_TICKER} from '../../../utils/constants';

interface ZapProps extends ModalProps {
  onConfirm: (zapAsset: string, lpName: string, amount: string, slippageBp: string) => void;
  tokenName?: string;
  decimals?: number;
  showEstimates?: boolean;
}

const ZapModal: React.FC<ZapProps> = ({ onConfirm, onDismiss, tokenName = '', decimals = 18, showEstimates = false }) => {
  const tombFinance = useTombFinance();
  const { balance } = useWallet();
  const ftmBalance = (Number(balance) / 1e18).toFixed(4).toString();
  const tombBalance = useTokenBalance(tombFinance.TOMB);
  const tshareBalance = useTokenBalance(tombFinance.TSHARE);
  const daiBalance = useTokenBalance(tombFinance.FTM);
  const avaxBalance = useTokenBalance(tombFinance.WAVAX);
  const [val, setVal] = useState('');
  const [slippage, setSlippage] = useState('2');
  const [zappingToken, setZappingToken] = useState(WFTM_TICKER);
  const [zappingTokenBalance, setZappingTokenBalance] = useState(ftmBalance);
  const [estimate, setEstimate] = useState({ token0: '0', token1: '0' }); // token0 will always be BNB in this case
  const [approveZapperStatus, approveZapper] = useApproveZapper(zappingToken);
  const tombFtmLpStats = useLpStats('FUDGE-DAI LP');
  const tShareFtmLpStats = useLpStats('STRAW-DAI LP');
  const tombLPStats = useMemo(() => (tombFtmLpStats ? tombFtmLpStats : null), [tombFtmLpStats]);
  const tshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const ftmAmountPerLP = tokenName.startsWith(TOMB_TICKER) ? tombLPStats?.ftmAmount : tshareLPStats?.ftmAmount;

  useEffect(() => {
    const lastTicker = localStorage.getItem('ZAP_TICKER');
    if (!!lastTicker) {
      setZappingToken(lastTicker);
      setZappingTokenBalance(ftmBalance);

      if (lastTicker === TSHARE_TICKER)
        setZappingTokenBalance(getDisplayBalance(tshareBalance, 18));
      if (lastTicker === TOMB_TICKER)
        setZappingTokenBalance(getDisplayBalance(tombBalance, 18));
      if (lastTicker === FTM_TICKER)
        setZappingTokenBalance(getDisplayBalance(daiBalance, 18));
      if (lastTicker === AVAX_TICKER)
        setZappingTokenBalance(getDisplayBalance(avaxBalance, 18));
    }
  }, [tshareBalance, tombBalance, daiBalance, ftmBalance, avaxBalance]);

  /**
   * Checks if a value is a valid number or not
   * @param n is the value to be evaluated for a number
   * @returns
   */
  function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  const handleChangeAsset = (event: any) => {
    if (event.target.value != zappingToken) {

      setZappingToken(event.target.value);
      setZappingTokenBalance(ftmBalance);
      if (event.target.value === TSHARE_TICKER) {
        setZappingTokenBalance(getDisplayBalance(tshareBalance, decimals));
      }
      if (event.target.value === TOMB_TICKER) {
        setZappingTokenBalance(getDisplayBalance(tombBalance, decimals));
      }
      if (event.target.value === FTM_TICKER) {
        setZappingTokenBalance(getDisplayBalance(daiBalance, decimals));
      }
      if (event.target.value === AVAX_TICKER) {
        setZappingTokenBalance(getDisplayBalance(avaxBalance, decimals));
      }

      localStorage.setItem('ZAP_TICKER', event.target.value)
    }
  };

  const handleChange = async (e: any) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setVal(e.currentTarget.value);
      if (showEstimates) setEstimate({ token0: '0', token1: '0' });
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setVal(e.currentTarget.value);
    if (showEstimates) {
      const estimateZap = await tombFinance.estimateZapIn(zappingToken, tokenName, String(e.currentTarget.value));
      setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
    }
  };

  const handleSelectMax = async () => {
    setVal(zappingTokenBalance);
    if (showEstimates) {
      const estimateZap = await tombFinance.estimateZapIn(zappingToken, tokenName, String(zappingTokenBalance));
      setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
    }
  };

  return (
    <Modal>
      <ModalTitle text={`Zap in ${tokenName}`} />

      <StyledActionSpacer />
      <InputLabel style={{ fontWeight:'700', color: '#000', marginBottom: '-1rem' }} id="label">
        Select Token
      </InputLabel>
      <br />
      <Select variant="outlined" onChange={handleChangeAsset} style={{ borderRadius:'10px', color: 'black', background: 'rgb(8, 9, 13, 1, 0.9)' }} labelId="label" id="select" value={zappingToken}>
        <StyledMenuItem value={FTM_TICKER}>DAI</StyledMenuItem>
        {/* <StyledMenuItem value={AVAX_TICKER}>AVAX</StyledMenuItem> */}
        <StyledMenuItem value={TSHARE_TICKER}>STRAW</StyledMenuItem>
        <StyledMenuItem value={TOMB_TICKER}>FUDGE</StyledMenuItem>
      </Select>
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={zappingTokenBalance}
        symbol={zappingToken}
      />
      <br />
      {showEstimates && <><Label variant="primary" text="Zap Estimations" />
        <br />
        <StyledDescriptionText>
          {' '}
          {tokenName}: {Number(estimate.token0) / Number(ftmAmountPerLP)}
        </StyledDescriptionText>
        {tokenName.startsWith(TOMB_TICKER) ?
          <StyledDescriptionText>
            {' '}
            ({Number(estimate.token0)} {tokenName.startsWith(TOMB_TICKER) ? FTM_TICKER : TOMB_TICKER} /{' '}
            {Number(estimate.token1)} {tokenName.startsWith(TOMB_TICKER) ? TOMB_TICKER : FTM_TICKER}){' '}
          </StyledDescriptionText>
          :
          <StyledDescriptionText>
            {' '}
            ({Number(estimate.token0)} {tokenName.startsWith(TSHARE_TICKER) ? TSHARE_TICKER : FTM_TICKER} /{' '}
            {Number(estimate.token1)} {tokenName.startsWith(TSHARE_TICKER) ? FTM_TICKER : TSHARE_TICKER}){' '}
          </StyledDescriptionText>}
      </>}
      <InputLabel style={{ color: '#1d48b6', marginBottom: '1rem' }} id="label">
        Slippage Tolerance
      </InputLabel>
      <Input
        value={String(slippage)}
        onPointerDown={() => setSlippage('')}
        onBlur={() => !(slippage && isNumeric(slippage)) && setSlippage('2')}
        onChange={(e: any) => setSlippage(!!e.currentTarget.value && isNumeric(e.currentTarget.value) ? e.currentTarget.value : '')}
        placeholder="0"
        endAdornment={<div style={{ marginBottom: '1px' }}>%</div>}
        fullWidth={false}
        style={{ maxWidth: '2.5rem', marginLeft: '14px' }}
      />
      <ModalActions>
        <Button
          color="primary"
          variant="contained"
          onClick={() =>
            approveZapperStatus !== ApprovalState.APPROVED
              ? approveZapper()
              : onConfirm(zappingToken, tokenName, val, String(+slippage * 100))
          }
        >
          {approveZapperStatus !== ApprovalState.APPROVED ? 'Approve' : "Zap"}
        </Button>
      </ModalActions>

      {/* <StyledActionSpacer />
      <Alert variant="outlined" severity="info">
        New feature. Use at your own risk!
      </Alert> */}
    </Modal>
  );
};

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledDescriptionText = styled.div`
  align-items: center;
  color: ${(props) => props.theme.color.grey[400]};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 22px;
  justify-content: flex-start;
`;
const StyledMenuItem = withStyles({
  root: {
    backgroundColor: 'white',
    color: '#2c2560',
    '&:hover': {
      backgroundColor: 'grey',
      color: '#2c2560',
    },
    selected: {
      backgroundColor: 'black',
    },
  },
})(MenuItem);

export default ZapModal;
