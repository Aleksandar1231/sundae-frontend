import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Page from '../../components/Page';
import PitImage from '../../assets/img/none.png';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
import useTombFinance from '../../hooks/useTombFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import { useTransactionAdder } from '../../state/transactions/hooks';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../tomb-finance/constants';
import { Box, CardContent, /* Button ,*/ Typography, Grid } from '@material-ui/core';
import Card from '../../components/Card';
import useTombStats from '../../hooks/useTombStats';
/* const BackgroundImage = createGlobalStyle`
  body {
    background: url(${PitImage}) no-repeat !important;
    background-size: cover !important;
  }
`;
 */
const Pit: React.FC = () => {
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const tombFinance = useTombFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  const cashPrice = useCashPriceInLastTWAP();
  const bondsPurchasable = useBondsPurchasable();

  const bondBalance = useTokenBalance(tombFinance?.TBOND);
  const [tombBalance, setTombBalance] = useState('0')
  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await tombFinance.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} CARAML with ${amount} FUDGE`,
      });
    },
    [tombFinance, addTransaction],
  );

  useEffect(() => {
    const getTombBalance = async () => {
      const { Treasury } = tombFinance.contracts
      const tombBalance = await tombFinance.TOMB.balanceOf(Treasury.address);
      setTombBalance(getDisplayBalance(tombBalance, 18, 0));
    }
    getTombBalance();
  })


  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await tombFinance.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} CARAML` });
    },
    [tombFinance, addTransaction],
  );
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat]);

  return (
    <Switch>
      <Page>
        {/* <BackgroundImage /> */}
        {!!account ? (
          <>
            <Route exact path={path}>
              <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
                Bonds
              </Typography>
              <Typography color="textPrimary" align="center" variant="h5" gutterBottom>
                Earn premiums upon redemption
              </Typography>
            </Route>
            <StyledBond style={{ marginTop: '40px' }}>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Purchase"
                  fromToken={tombFinance.TOMB}
                  fromTokenName="FUDGE"
                  toToken={tombFinance.TBOND}
                  toTokenName="CARAML"
                  priceDesc={
                    !isBondPurchasable
                      ? 'FUDGE is over peg'
                      : getDisplayBalance(bondsPurchasable, 18, 4) + ' CARAML available for purchase'
                  }
                  onExchange={handleBuyBonds}
                  disabled={!bondStat || isBondRedeemable}
                />
              </StyledCardWrapper>
              <StyledStatsWrapper>
                <ExchangeStat
                  tokenName="FUDGE"
                  description="Last-Hour TWAP Price"
                  price={getDisplayBalance(cashPrice, 18, 4)}
                />
                <Spacer size="md" />
                <ExchangeStat
                  tokenName="CARAML"
                  description="Current Price: (FUDGE)^2"
                  price={Number(bondStat?.tokenInFtm).toFixed(2) || '-'}
                />
                <StyledSupplyWrapper>
                  <Card>
                    <CardContent>
                      <Typography variant="h4" style={{ textAlign: 'center' }}>{Number(bondStat?.totalSupply)}</Typography>
                      <Typography style={{ textAlign: 'center' }}>CARAML Supply</Typography>
                    </CardContent>
                  </Card>
                  <Spacer size="md" />
                  <Card>
                    <CardContent>
                      <Typography variant="h4" style={{ textAlign: 'center' }}>{tombBalance}</Typography>
                      <Typography style={{ textAlign: 'center' }}>FUDGE Reserves</Typography>
                    </CardContent>
                  </Card>
                </StyledSupplyWrapper>
              </StyledStatsWrapper>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Redeem"
                  fromToken={tombFinance.TBOND}
                  fromTokenName="CARAML"
                  toToken={tombFinance.TOMB}
                  toTokenName="FUDGE"
                  priceDesc={`${getDisplayBalance(bondBalance)} CARAML Available in wallet`}
                  onExchange={handleRedeemBonds}
                  disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                  disabledDescription={!isBondRedeemable ? `Enabled when FUDGE > ${BOND_REDEEM_PRICE} DAI` : null}
                />
              </StyledCardWrapper>
            </StyledBond>
          </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

const StyledBond = styled.div`
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const StyledStatsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 0 20px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80%;
    margin: 16px 0;
  }
`;

const StyledSupplyWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 20px 0 0 0;
  flex-direction: row;
`;

export default Pit;
