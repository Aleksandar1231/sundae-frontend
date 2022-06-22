import React, {useMemo} from 'react';
import styled from 'styled-components';
import {Button, CardContent, Grid, Typography} from '@material-ui/core';
import Card from '../../../components/Card';
import DepositModal from './DepositModal';

import Label from '../../../components/Label';
import Value from '../../../components/Value';

import useApprove, {ApprovalState} from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useStake from '../../../hooks/useStake';
import useNodePrice from '../../../hooks/useNodePrice';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
import useTokenBalance from '../../../hooks/useTokenBalance';
import {getDisplayBalance} from '../../../utils/formatBalance';
import TokenSymbol from '../../../components/TokenSymbol';

const Stake = ({bank}) => {
  const [approveStatus, approve] = useApprove(bank.depositToken, bank.address);
  const tokenBalance = useTokenBalance(bank.depositToken);
  const nodePrice = useNodePrice(bank.contract, bank.poolId, bank.sectionInUI);
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bank.depositTokenName, bank.depositToken);

  const tokenPriceInDollars = useMemo(
    () => (stakedTokenPriceInDollars ? stakedTokenPriceInDollars : null),
    [stakedTokenPriceInDollars],
  );
  const earnedInDollars = (
    Number(tokenPriceInDollars) * Number(getDisplayBalance(nodePrice, bank.depositToken.decimal))
  ).toFixed(2);
  const {onStake} = useStake(bank);


  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      bank={bank}
      max={tokenBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onStake(amount);
        onDismissDeposit();
      }}
      tokenName={bank.depositTokenName}
    />,
  );



  return (
    <Card>
      <CardContent>    
        <StyledCardContentInner>         
          <StyledCardHeader>        
            <Grid>
              <TokenSymbol symbol={'NODE'} size={54} />
            </Grid>
            <Typography style={{textTransform: 'uppercase', color: '#930993'}}>
              <Value value={getDisplayBalance(nodePrice, bank.depositToken.decimal, 1)} />
            </Typography>

            <Label text={`≈ $${earnedInDollars}`} />

            <Typography style={{textTransform: 'uppercase', color: '#fff'}}>{`NODE COST`}</Typography>
          </StyledCardHeader>
          <StyledCardActions>
            {approveStatus !== ApprovalState.APPROVED ? (
                <Button
                  color= "primary"
                  variant= "contained"
                  disabled={
                    bank.closedForStaking ||
                    approveStatus === ApprovalState.PENDING ||
                    approveStatus === ApprovalState.UNKNOWN
                  }
                  onClick={approve}
                  className={
                    bank.closedForStaking ||
                    approveStatus === ApprovalState.PENDING ||
                    approveStatus === ApprovalState.UNKNOWN
                      ? 'shinyButtonDisabled'
                      : 'shinyButtonSecondary'
                  }
                  style={{marginTop: '20px'}}
                >
                  {`Approve ${bank.depositTokenName}`}
                </Button>
              ) : (
                <Button
                  color= "primary"
                  variant= "contained"
                  disabled={bank.closedForStaking}
                  onClick={() => (bank.closedForStaking ? null : onPresentDeposit())}
                >
                  Purchase Node
                </Button>
              )
            }
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
  width: 100%;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Stake;