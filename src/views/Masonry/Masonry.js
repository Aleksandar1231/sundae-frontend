import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import moment from 'moment';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import { makeStyles } from '@material-ui/core/styles';

import { Box, CardContent, Button, Typography, Grid, Card as Carder } from '@material-ui/core';
import Card from '../../components/Card';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';

import { getDisplayBalance } from '../../utils/formatBalance';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useFetchMasonryAPR from '../../hooks/useFetchMasonryAPR';

import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useTotalStakedOnMasonry from '../../hooks/useTotalStakedOnMasonry';
import ProgressCountdown from './components/ProgressCountdown';
import useTreasuryAllocate from '../../hooks/useTreasuryAllocate';
import useTombFinance from '../../hooks/useTombFinance';
import useShareStats from '../../hooks/usetShareStats';
import { ethers } from 'ethers';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '100%',
    },
  },
}));

const Masonry = () => {
  const classes = useStyles();
  const { account } = useWallet();
  const currentEpoch = useCurrentEpoch();
  const cashStat = useCashPriceInEstimatedTWAP();
  const totalStaked = useTotalStakedOnMasonry();
  const masonryAPR = useFetchMasonryAPR();
  const { onAllocate } = useTreasuryAllocate();
  const tokenStats = useShareStats();
  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
  const { to } = useTreasuryAllocationTimes();

  const tokenPriceInDollars = useMemo(() => (tokenStats ? Number(tokenStats.priceInDollars).toFixed(2) : null), [
    tokenStats,
  ]);

  const tvl = tokenPriceInDollars
    ? (Number(getDisplayBalance(totalStaked, 18)) * Number(tokenPriceInDollars)).toFixed(2)
    : 0;
  console.log(tvl);
  return (
    <Page>
      {!!account ? (
        <>
          <br />
          <br />
          <br />
          <br />
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item xs={12} lg={5} className={classes.gridItem}>
              <Carder style={{ background: 'transparent', borderRadius: '15px', height:'400px' }} className={classes.gridItem}>
                <CardContent>
                  <Typography
                    color="textPrimary"
                    align="center"
                    variant="h3"
                    gutterBottom
                    style={{ marginTop: '50px' }}
                  >
                    Boardroom
                  </Typography>
                  <Typography
                    color="textPrimary"
                    align="center"
                    variant="h5"
                    gutterBottom
                    style={{ marginTop: '25px' }}
                  >
                    Earn FUDGE by staking STRAW
                  </Typography>
                  <Typography
                    color="textPrimary"
                    align="center"
                    variant="h6"
                    gutterBottom
                    style={{ marginTop: '25px' }}
                  >
                    This is where our members stake their STRAW for FUDGE expansion rewards. As long as
                    the time-weighted average price (TWAP) of FUDGE is 1.01 or higher, new tokens will be minted when
                    an epoch passes.
                  </Typography>
                </CardContent>
              </Carder>
            </Grid>

            <Grid item xs={12} lg={4} className={classes.gridItem}>
              <Carder style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: '15px', height:'400px' }} className={classes.gridItem}>
                <CardContent>
                  <Grid
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <h3 style={{ margin: '10px', textAlign: 'center', color: '#000', fontSize: '18px', marginTop: '25px' }}>
                      Total Value Locked
                    </h3>
                    <h2 style={{fontSize:"35px", marginBottom:"45px"}}>${tvl}</h2>
                  </Grid>
                  <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Grid>
                      <h3 style={{ margin: '10px', textAlign: 'center', color: '#000', fontSize: '18px' }}>
                        Next Epoch:
                      </h3>
                    </Grid>
                    <Grid>
                      <ProgressCountdown
                        style={{
                          fontWeight: 'lighter',
                          display: 'flex',
                          fontSize: '1.5rem',
                          marginTop: '8px',
                          justifyContent: 'center',
                        }}
                        base={moment().toDate()}
                        hideBar={true}
                        deadline={to}
                        description="Next Epoch"
                      />
                    </Grid>
                  </Grid>
                  <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Grid>
                      <h3 style={{ margin: '10px', textAlign: 'center', color: '#000', fontSize: '18px' }}>
                        Current Epoch:
                      </h3>
                    </Grid>
                    <Grid>
                      <h2
                        style={{
                          fontWeight: 'lighter',
                          display: 'flex',
                          fontSize: '1.5rem',
                          marginTop: '8px',
                          justifyContent: 'center',
                        }}
                      >
                        {Number(currentEpoch)}
                      </h2>
                    </Grid>
                  </Grid>
                  <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Grid>
                      <h3 style={{ margin: '10px', textAlign: 'center', color: '#000', fontSize: '18px' }}>TWAP</h3>
                    </Grid>
                    <Grid>
                      <h2
                        style={{
                          fontWeight: 'lighter',
                          display: 'flex',
                          fontSize: '1.5rem',
                          marginTop: '8px',
                          justifyContent: 'center',
                        }}
                      >
                        {scalingFactor}
                      </h2>
                    </Grid>
                  </Grid>
                  <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Grid>
                      <h3 style={{ margin: '10px', textAlign: 'center', color: '#000', fontSize: '18px' }}>
                        Daily APR
                      </h3>
                    </Grid>
                    <Grid>
                      <h2
                        style={{
                          fontWeight: 'lighter',
                          display: 'flex',
                          fontSize: '1.5rem',
                          marginTop: '8px',
                          justifyContent: 'center',
                        }}
                      >
                        {(masonryAPR / 365).toFixed(2)}%
                      </h2>
                    </Grid>
                  </Grid>
                  <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Grid>
                      <h3 style={{ margin: '10px', textAlign: 'center', color: '#000', fontSize: '18px' }}>
                        STRAW Staked
                      </h3>
                    </Grid>
                    <Grid>
                      <h2
                        style={{
                          fontWeight: 'lighter',
                          display: 'flex',
                          fontSize: '1.5rem',
                          marginTop: '8px',
                          justifyContent: 'center',
                        }}
                      >
                        {getDisplayBalance(totalStaked)}
                      </h2>
                    </Grid>
                  </Grid>
                </CardContent>
              </Carder>
            </Grid>
          </Grid>

          <Box mt={5}>
            {/* <Grid container justifyContent="center">
              <Box mt={3} style={{ width: '600px', margin: '10px' }}>
                <Box mt={5}>
                  <Grid container justifyContent="center" spacing={3} mt={10}>
                    <Button
                      // disabled='false'
                      onClick={onAllocate}
                      color="primary"
                      variant="contained"
                    >
                      Print FUDGE when timer expires
                    </Button>
                  </Grid>
                </Box>
              </Box>
            </Grid> */}

            <Box mt={4}>
              <StyledBoardroom>
                <StyledCardsWrapper>
                  <StyledCardWrapper>
                    <Harvest />
                  </StyledCardWrapper>
                  <Spacer />
                  <StyledCardWrapper>
                    <Stake />
                  </StyledCardWrapper>
                </StyledCardsWrapper>
              </StyledBoardroom>
            </Box>

            <Grid container justifyContent="center">
              <Box mt={3} style={{ width: '600px', margin: '10px' }}>
                <Box mt={5}>
                  <Grid container justifyContent="center" spacing={3} mt={10}>
                    <Button
                      // disabled='false'
                      onClick={onAllocate}
                      color="primary"
                      variant="contained"
                    >
                      Print FUDGE when timer expires
                    </Button>
                  </Grid>
                </Box>
              </Box>
            </Grid>

            {/* <Grid container justify="center" spacing={3}>
            <Grid item xs={4}>
              <Card>
                <CardContent align="center">
                  <Typography>Rewards</Typography>

                </CardContent>
                <CardActions style={{justifyContent: 'center'}}>
                  <Button color="primary" variant="outlined">Claim Reward</Button>
                </CardActions>
                <CardContent align="center">
                  <Typography>Claim Countdown</Typography>
                  <Typography>00:00:00</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent align="center">
                  <Typography>Stakings</Typography>
                  <Typography>{getDisplayBalance(stakedBalance)}</Typography>
                </CardContent>
                <CardActions style={{justifyContent: 'center'}}>
                  <Button>+</Button>
                  <Button>-</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid> */}
          </Box>
        </>
      ) : (
        <UnlockWallet />
      )}
    </Page>
  );
};

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
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

export default Masonry;
