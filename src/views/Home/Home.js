import React, { useMemo, useState } from 'react';
import Page from '../../components/Page';
import HomeImage from '../../assets/img/home.png';
import CashImage from '../../assets/img/3OMB.svg';
import Image from 'material-ui-image';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import { useWallet } from 'use-wallet';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useTombStats from '../../hooks/useTombStats';
import useLpStats from '../../hooks/useLpStats';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usetShareStats from '../../hooks/usetShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useFantomPrice from '../../hooks/useFantomPrice';
import { getDisplayBalance } from '../../utils/formatBalance';
import useTokenBalance from '../../hooks/useTokenBalance';
import { tomb as tombTesting, tShare as tShareTesting } from '../../tomb-finance/deployments/deployments.testing.json';
import { tomb as tombProd, tShare as tShareProd } from '../../tomb-finance/deployments/deployments.mainnet.json';
import useTotalTreasuryBalance from '../../hooks/useTotalTreasuryBalance.js';
import useRebateTreasury from '../../hooks/useRebateTreasury';

import { Box, Button, Card, CardContent, Grid, Paper, Typography } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';

import { makeStyles } from '@material-ui/core/styles';
import useTombFinance from '../../hooks/useTombFinance';

// const BackgroundImage = createGlobalStyle`
//   body {
//     background-color: var(--black);
// }

// * {
//     border-radius: 0 !important;
// }
// `;

const BackgroundImage = createGlobalStyle`
  body {
    background-color: var(--black);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='%231D1E1F' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E");
}

* {
    border-radius: 0 !important;
}
`;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      marginTop: '10px',
    },
  },
  card: {
    backgroundColor: 'rgba(229, 152, 155, 0.1)',
    boxShadow: 'none',
    border: '1px solid var(--white)',
  },
}));

const buyfudgeAddress = 'https://traderjoexyz.com/trade?outputCurrency=0xD9FF12172803c072a36785DeFea1Aa981A6A0C18#/';
const viewFudgeAddress = 'https://dexscreener.com/avalanche/0xe367414f29e247b2d92edd610aa6dd5a7fd631ba';
const viewStrawAddress = 'https://dexscreener.com/avalanche/0x5eef38855090ccc49a1b7391f4c7b9efbdfe1456';
const buystrawAddress = 'https://traderjoexyz.com/trade?outputCurrency=0xf8D0C6c3ddC03F43A0687847f2b34bfd6941C2A2#/';

const Home = () => {
  const rebateStats = useRebateTreasury();
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const tombFtmLpStats = useLpStats('TOMB-FTM-LP');
  const tShareFtmLpStats = useLpStats('TSHARE-FTM-LP');
  const tombStats = useTombStats();
  const tShareStats = usetShareStats();
  const tBondStats = useBondStats();
  const tombFinance = useTombFinance();
  const { price: ftmPrice, marketCap: ftmMarketCap, priceChange: ftmPriceChange } = useFantomPrice();
  const { balance: rebatesTVL } = useTotalTreasuryBalance();
  const {
    balance,
    balance_2shares_wftm,
    balance_3omb_wftm,
    balance_3shares_wftm,
    balance_3omb,
    balance_3shares,
    balance_2shares,
  } = useTotalTreasuryBalance();
  const totalTVL = TVL + rebatesTVL;
  const tombBalance = useTokenBalance(tombFinance.TOMB);
  const displayTombBalance = useMemo(() => getDisplayBalance(tombBalance), [tombBalance]);

  const tshareBalance = useTokenBalance(tombFinance.TSHARE);
  const displayTshareBalance = useMemo(() => getDisplayBalance(tshareBalance), [tshareBalance]);

  const tbondBalance = useTokenBalance(tombFinance.TBOND);
  const displayTbondBalance = useMemo(() => getDisplayBalance(tbondBalance), [tbondBalance]);
  const { account } = useWallet();

  let tomb;
  let tShare;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    tomb = tombTesting;
    tShare = tShareTesting;
  } else {
    tomb = tombProd;
    tShare = tShareProd;
  }

  const buyTombAddress = 'https://traderjoexyz.com/trade/' + tomb.address;
  const buyTShareAddress = 'https://traderjoexyz.com/trade/' + tShare.address;

  const tombLPStats = useMemo(() => (tombFtmLpStats ? tombFtmLpStats : null), [tombFtmLpStats]);
  const tshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const tombPriceInDollars = useMemo(
    () => (tombStats ? Number(tombStats.priceInDollars).toFixed(2) : null),
    [tombStats],
  );
  const tombPriceInFTM = useMemo(() => (tombStats ? Number(tombStats.tokenInFtm).toFixed(4) : null), [tombStats]);
  const tombCirculatingSupply = useMemo(() => (tombStats ? String(tombStats.circulatingSupply) : null), [tombStats]);
  const tombTotalSupply = useMemo(() => (tombStats ? String(tombStats.totalSupply) : null), [tombStats]);

  const tSharePriceInDollars = useMemo(
    () => (tShareStats ? Number(tShareStats.priceInDollars).toFixed(2) : null),
    [tShareStats],
  );
  const tSharePriceInFTM = useMemo(
    () => (tShareStats ? Number(tShareStats.tokenInFtm).toFixed(4) : null),
    [tShareStats],
  );
  const tShareCirculatingSupply = useMemo(
    () => (tShareStats ? String(tShareStats.circulatingSupply) : null),
    [tShareStats],
  );
  const tShareTotalSupply = useMemo(() => (tShareStats ? String(tShareStats.totalSupply) : null), [tShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInFTM = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const tombLpZap = useZap({ depositTokenName: 'TOMB-FTM-LP' });
  const tshareLpZap = useZap({ depositTokenName: 'TSHARE-FTM-LP' });

  const StyledLink = styled.a`
    font-weight: 700;
    text-decoration: none;
    color: var(--accent-light);
  `;

  const [onPresentTombZap, onDissmissTombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        tombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissTombZap();
      }}
      tokenName={'TOMB-FTM-LP'}
    />,
  );

  const [onPresentTshareZap, onDissmissTshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        tshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissTshareZap();
      }}
      tokenName={'TSHARE-FTM-LP'}
    />,
  );

  // const handleMouseOverFudge = () => {
  //   setIsHoveringFudge(true);
  // };

  // const handleMouseOutFudge = () => {
  //   setIsHoveringFudge(false);
  // };

  // const handleMouseOverStraw = () => {
  //   setIsHoveringStraw(true);
  // };

  // const handleMouseOutStraw = () => {
  //   setIsHoveringStraw(false);
  // };

  // const handleMouseOverCaraml = () => {
  //   setIsHoveringCaraml(true);
  // };

  // const handleMouseOutCaraml = () => {
  //   setIsHoveringCaraml(false);
  // };

  // const [isHoveringFudge, setIsHoveringFudge] = useState(false);
  // const [isHoveringStraw, setIsHoveringStraw] = useState(false);
  // const [isHoveringCaraml, setIsHoveringCaraml] = useState(false);

  return (
    <Page>
      <BackgroundImage />
      <Grid container spacing={3}>
        {/* Logo */}
        {/* <Grid container item xs={12} sm={4} justify="center">
          <Paper>xs=6 sm=3</Paper> 
          <Image color="none" style={{ width: '300px', paddingTop: '0px' }} src={CashImage} />
        </Grid> */}
        {/* Explanation text */}
        <Grid container direction="column" alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={8}>
            <Paper style={{ backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}>
              <Box p={4} display="flex" justifyContent="center" alignItems="center">
                <Typography variant="h3" fontWeight="bold" align="center" className="gradient-text">
                  Farm STRAW and earn rewards on the sweetest protocol on Avalanche!
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* <Grid container justify="center">
          <Box mt={3} style={{ width: '1000px' }}>
            <Alert variant="filled" severity="warning">
              Do your own research before investing. Investing is risky and may result in monetary loss. GEM Finance is
              beta software and may contain bugs. By using GEM Finance, you agree that the GemFinance team is not
              responsible for any financial losses.
            </Alert>
          </Box>
        </Grid> */}

        {/* <Grid container spacing={3}>
        <Grid item  xs={12} sm={12} justify="center"  style={{ margin: '12px', display: 'flex' }}>
            <Alert severity="warning" style={{ backgroundColor: "transparent", border: "1px solid var(--white)" }}>
              <b>
          Please visit our <StyledLink target="_blank" href="https://docs.tomb.finance">documentation</StyledLink> before purchasing TOMB or TSHARE!</b>
            </Alert>
        </Grid>
        </Grid> */}
        {/* TVL */}
        <Grid container justify="center">
          <Box mt={3}>
            <Card style={{ backgroundColor: 'none', boxShadow: 'none', border: 'none' }}>
              <CardContent align="center">
                <h3>Total Value Locked</h3>
                <CountUp style={{ fontSize: '40px' }} end={TVL} separator="," prefix="$" />
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Wallet */}
        {/* <Grid item xs={12} sm={8}>
          <Card
            style={{
              height: '100%',
              backgroundColor: 'transparent',
              boxShadow: 'none',
              border: '1px solid var(--white)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CardContent align="center">
              <Button color="primary" href="/farms" variant="contained" style={{ marginRight: '10px' }}>
                Farms
              </Button>
              <Button color="primary" href="/boardroom" variant="contained" style={{ marginRight: '25px' }}>
                Stake
              </Button>
              <Button
                target="_blank"
                href="https://spookyswap.finance/swap?outputCurrency=0x14def7584a6c52f470ca4f4b9671056b22f4ffde"
                variant="contained"
                style={{ marginRight: '10px' }}
                className={classes.button}
              >
                Buy 3OMB
              </Button>
              <Button
                variant="contained"
                target="_blank"
                href="https://spookyswap.finance/swap?outputCurrency=0x6437adac543583c4b31bf0323a0870430f5cc2e7"
                style={{ marginRight: '10px' }}
                className={classes.button}
              >
                Buy 3SHARES
              </Button>
              <Button
                variant="contained"
                target="_blank"
                href="https://dexscreener.com/fantom/0x83a52eff2e9d112e9b022399a9fd22a9db7d33ae"
                style={{ marginRight: '10px' }}
                className={classes.button}
              >
                3OMB Chart
              </Button>
              <Button
                variant="contained"
                target="_blank"
                href="https://dexscreener.com/fantom/0xd352dac95a91afefb112dbbb3463ccfa5ec15b65"
                className={classes.button}
              >
                3SHARES Chart
              </Button>
            </CardContent>
          </Card>
        </Grid> */}

        {/* Coin Price */}
        {/* <Grid item xs={12} sm={3}>
          <Card style={{ backgroundColor: 'transparent', boxShadow: 'none', border: '1px solid var(--white)' }}>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>FTM</h2>
              <Box mt={2} style={{ backgroundColor: 'transparent !important' }}>
                <CardIcon style={{ backgroundColor: 'transparent !important' }}>
                  <TokenSymbol symbol="wFTM" style={{ backgroundColor: 'transparent !important' }} />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>${ftmPrice ? ftmPrice : '-.----'} USD</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${ftmMarketCap} <br />
                Price Change 24h: {ftmPriceChange.toFixed(2)}% <br />
                <br />
                <br />
              </span>
            </CardContent>
          </Card>
        </Grid> */}

        {/* Governance Coin */}
        <Grid item xs={12} sm={4}>
          <Card
            style={{ backgroundColor: 'rgba(229, 152, 155, 0.1)', boxShadow: 'none', border: '1px solid var(--white)' }}
          // onMouseOver={handleMouseOverFudge}
          // onMouseOut={handleMouseOutFudge}
          >
            <CardContent align="center" style={{ position: 'relative' }}>
              <div>
                <h2>FUDGE</h2>
              </div>
              <div>
                <h3>Governance Token</h3>
              </div>
              {account ? (
                <div>
                  <h4>In Wallet: {displayTombBalance}</h4>
                </div>
              ) : (
                <></>
              )}
              {/*                <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('TOMB');
                }}
                color="secondary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px', borderColor: "var(--accent-light)" }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>  */}
              <Box mt={2} style={{ backgroundColor: 'transparent !important' }}>
                <CardIcon style={{ backgroundColor: 'transparent !important' }}>
                  <TokenSymbol symbol="TOMB" style={{ backgroundColor: 'transparent !important' }} />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>${tombPriceInDollars ? tombPriceInDollars : '-.--'} </span>
                {/* <span style={{ fontSize: '30px' }}>{tombPriceInFTM ? tombPriceInFTM : '-.----'} </span> */}
              </Box>
              {/* <Box>
                <span style={{ fontSize: '16px', alignContent: 'flex-start' }}>
                  ${tombPriceInDollars ? tombPriceInDollars : '-.--'}
                </span>
              </Box> */}
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(tombCirculatingSupply * tombPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {tombCirculatingSupply} <br />
                Total Supply: {tombTotalSupply}
              </span>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '20px', marginRight: '5px' }}
                  target="_blank"
                  href={buyfudgeAddress}
                >
                  Buy Now
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '20px', marginRight: '5px' }}
                  target="_blank"
                  href={viewFudgeAddress}
                >
                  Chart
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* GSHARE */}
        <Grid item xs={12} sm={4}>
          <Card
            style={{ backgroundColor: 'rgba(229, 152, 155, 0.1)', boxShadow: 'none', border: '1px solid var(--white)' }}
          // onMouseOver={handleMouseOverStraw}
          // onMouseOut={handleMouseOutStraw}
          >
            <CardContent align="center" style={{ position: 'relative' }}>
              <div>
                <h2>STRAW</h2>
              </div>
              <div>
                <h3>Share Token</h3>
              </div>
              {account ? (
                <div>
                  <h4>In Wallet: {displayTshareBalance}</h4>
                </div>
              ) : (
                <></>
              )}
              {/* <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('TSHARE');
                }}
                color="secondary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px', borderColor: "var(--accent-light)" }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button> */}
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="TSHARE" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>${tSharePriceInDollars ? tSharePriceInDollars : '-.--'}</span>
                {/* <span style={{ fontSize: '30px' }}>{tSharePriceInFTM ? tSharePriceInFTM : '-.----'} </span> */}
              </Box>
              {/* <Box>
                <span style={{ fontSize: '16px' }}>${tSharePriceInDollars ? tSharePriceInDollars : '-.--'}</span>
              </Box> */}
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(tShareCirculatingSupply * tSharePriceInDollars).toFixed(2)} <br />
                Circulating Supply: {tShareCirculatingSupply} <br />
                Total Supply: {tShareTotalSupply}
              </span>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '20px', marginRight: '5px' }}
                  target="_blank"
                  href={buystrawAddress}
                >
                  Buy Now
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '20px', marginRight: '5px' }}
                  target="_blank"
                  href={viewStrawAddress}
                >
                  Chart
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* GBOND */}
        <Grid item xs={12} sm={4}>
          <Card
            style={{ backgroundColor: 'rgba(229, 152, 155, 0.1)', boxShadow: 'none', border: '1px solid var(--white)' }}
          // onMouseOver={handleMouseOverCaraml}
          // onMouseOut={handleMouseOutCaraml}
          >
            <CardContent align="center" style={{ position: 'relative' }}>
              <div>
                <h2>CARAML</h2>
              </div>
              <div>
                <h3>Bond Token</h3>
              </div>
              {account ? (
                <div>
                  <h4>In Wallet: {displayTshareBalance}</h4>
                </div>
              ) : (
                <></>
              )}
              {/* <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('TBOND');
                }}
                color="secondary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px', borderColor: "var(--accent-light)" }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button> */}
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="TBOND" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</span>
                {/* <span style={{ fontSize: '30px' }}>{tBondPriceInFTM ? tBondPriceInFTM : '-.----'} </span> */}
              </Box>
              {/* <Box>
                <span style={{ fontSize: '16px' }}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</span>
              </Box> */}
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(tBondCirculatingSupply * tBondPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {tBondCirculatingSupply} <br />
                Total Supply: {tBondTotalSupply}
              </span>
              <Box>
                <Button variant="contained" color="primary" style={{ marginTop: '20px' }} href="/bonds">
                  View BONDS
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* LP POOLS */}

        {/* <Grid item xs={12} sm={6}>
          <Card style={{ backgroundColor: 'transparent', boxShadow: 'none', border: '1px solid var(--white)' }}>
            <CardContent align="center">
              <h2>3OMB-WFTM Spooky LP</h2>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="TOMB-FTM-LP" />
                </CardIcon>
              </Box>

              <Box mt={2}>
                <Button color="primary" disabled={true} onClick={onPresentTombZap} variant="contained">
                  Zap In
                </Button>
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {tombLPStats?.tokenAmount ? tombLPStats?.tokenAmount : '-.--'} 3OMB /{' '}
                  {tombLPStats?.ftmAmount ? tombLPStats?.ftmAmount : '-.--'} FTM
                </span>
              </Box>
              <Box>${tombLPStats?.priceOfOne ? tombLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${tombLPStats?.totalLiquidity ? tombLPStats.totalLiquidity : '-.--'} <br />
                Total supply: {tombLPStats?.totalSupply ? tombLPStats.totalSupply : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid> */}

        {/* <Grid item xs={12} sm={6}>
          <Card style={{ backgroundColor: 'transparent', boxShadow: 'none', border: '1px solid var(--white)' }}>
            <CardContent align="center">
              <h2>3SHARES-WFTM Spooky LP</h2>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="TSHARE-FTM-LP" />
                </CardIcon>
              </Box>
              <Box mt={2}>
                <Button color="primary" onClick={onPresentTshareZap} variant="contained">
                  Zap In
                </Button>
            </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {tshareLPStats?.tokenAmount ? tshareLPStats?.tokenAmount : '-.--'} 3SHARE /{' '}
                  {tshareLPStats?.ftmAmount ? tshareLPStats?.ftmAmount : '-.--'} FTM
                </span>
              </Box>
              <Box>${tshareLPStats?.priceOfOne ? tshareLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${tshareLPStats?.totalLiquidity ? tshareLPStats.totalLiquidity : '-.--'}
                <br />
                Total supply: {tshareLPStats?.totalSupply ? tshareLPStats.totalSupply : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>

      <Box mt={2} style={{ marginTop: '50px' }}>
        <Typography align="center" variant="h4" gutterBottom style={{ marginBottom: '50px' }}>
          Protocol Owned Liquidity
        </Typography>
        <Grid container justify="center" align="center" spacing={3}>
          <Grid item xs={12} md={4} lg={4} className={classes.gridItem}>
            <Card
              style={{
                height: '100%',
                backgroundColor: 'rgba(229, 152, 155, 0.1)',
                boxShadow: 'none',
                border: '1px solid var(--white)',
              }}
            >
              <CardContent align="center">
                <Typography variant="h5">CREAM-AVAX LP:</Typography>
                <CountUp style={{ fontSize: '25px' }} end={balance_3omb_wftm} separator="," prefix="$" />
              </CardContent>
              <CardContent align="center">
                <Typography variant="h5">CSHARE-AVAX LP:</Typography>
                <CountUp style={{ fontSize: '25px' }} end={balance_3shares_wftm} separator="," prefix="$" />
              </CardContent>
              <CardContent align="center">
                <Typography variant="h5">CREAM-CSHARE LP:</Typography>
                <CountUp style={{ fontSize: '25px' }} end={balance_2shares_wftm} separator="," prefix="$" />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} lg={4} className={classes.gridItem}>
            <Card
              style={{
                height: '100%',
                backgroundColor: 'rgba(229, 152, 155, 0.1)',
                boxShadow: 'none',
                border: '1px solid var(--white)',
              }}
            >
              <CardContent align="center">
                <Typography variant="h5">FUDGE:</Typography>
                <CountUp style={{ fontSize: '25px' }} end={balance_3omb} separator="," prefix="$" />
              </CardContent>
              <CardContent align="center">
                <Typography variant="h5">STRAW:</Typography>
                <CountUp style={{ fontSize: '25px' }} end={balance_3shares} separator="," prefix="$" />
              </CardContent>
              <CardContent align="center">
                <Typography variant="h5">CARAML:</Typography>
                <CountUp style={{ fontSize: '25px' }} end={balance_2shares} separator="," prefix="$" />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} lg={4} justify="center" className={classes.gridItem}>
            <Card
              style={{
                height: 'auto',
                marginBottom: '10px',
                backgroundColor: 'rgba(229, 152, 155, 0.1)',
                boxShadow: 'none',
                border: '1px solid var(--white)',
              }}
            >
              <CardContent align="center">
                <Typography variant="h5">TWAP:</Typography>
                <Typography style={{ fontSize: '25px' }}>{tombPriceInFTM ? tombPriceInFTM : '-.----'} DAI</Typography>
              </CardContent>
            </Card>
            <Card
              justify="center"
              style={{ height: '100%' }}
              style={{
                marginBottom: '10px',
                backgroundColor: 'rgba(229, 152, 155, 0.1)',
                boxShadow: 'none',
                border: '1px solid var(--white)',
              }}
            >
              <CardContent align="center">
                <Typography variant="h5">Total Value Burned:</Typography>
                <CountUp style={{ fontSize: '25px' }} end={balance_3omb} separator="," prefix="$" />
              </CardContent>
            </Card>
            <Card
              style={{
                height: 'auto',
                backgroundColor: 'rgba(229, 152, 155, 0.1)',
                boxShadow: 'none',
                border: '1px solid var(--white)',
              }}
            >
              <CardContent align="center">
                <Typography variant="h5">Total Treasury Balance:</Typography>
                <CountUp style={{ fontSize: '25px' }} end={balance} separator="," prefix="$" />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
};

export default Home;
