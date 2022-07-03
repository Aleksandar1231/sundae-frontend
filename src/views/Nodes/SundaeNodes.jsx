import { Button, CardContent, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import Page from '../../components/Page';
import Card from '../../components/Card';
import SundaeNode from '../SundaeNode';
import FudgeCard from './FudgeCard';
import UnlockWallet from '../../components/UnlockWallet';
import { useWallet } from 'use-wallet';
import { Helmet } from 'react-helmet';
import { createGlobalStyle } from 'styled-components';
import ProgressCountdown from '../Masonry/components/ProgressCountdown';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Moralis from 'moralis/node';
import { lotteries, moralisConfiguration } from '../../config';
import { getLeaderboardTotal } from './util/getLeaderboardTotal';
import InfoCards from "../Nodes/component/InfoCards";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

const SundaeNodes = () => {
  const {path} = useRouteMatch();
  const { account } = useWallet();
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [userEntries, setUserEntries] = useState(null);
  const classes = useStyles();

  // const from = moment('2022-06-26 06:00 +0000');
  // const to = moment('2022-07-03 06:00 +0000');

  const from = moment('2022-06-26 12:00:00Z');
  const to = moment('2022-07-03 12:00:00Z');

  useEffect(() => {
    fetchLeaderboardData();
  }, [account]);

  const fetchLeaderboardData = async () => {
    // const params =  { };
    const Moralis = require('moralis/node');
    await Moralis.start({
      serverUrl: moralisConfiguration.serverUrl,
      appId: moralisConfiguration.appId,
    });

    const leaderboardData = await getLeaderboardTotal(lotteries, from, to);
    setLeaderboardData(leaderboardData);
    if (account) {
      const userEntries = leaderboardData.filter(data => data.wallet.toLowerCase() === account.toLowerCase());
      setUserEntries(userEntries.length > 0 ? userEntries : [{ 'entries': 0 }]);
    }
  };


  return (
    <Switch>
      <Page>
      {!!account ? (
        <>
        <Route exact path={path}>
        <Typography color="textPrimary" align="center" variant="h3" gutterBottom style={{marginTop:'50px'}}>
            Nodes
          </Typography>

          <Typography color="textPrimary" align="center" variant="h5" gutterBottom style={{marginTop:'25px'}}>
                Purchase nodes to earn rewards
              </Typography>
          <Grid container spacing={3} style={{marginTop: '75px'}}>
            <FudgeCard />
          </Grid>

          <p>&nbsp;</p>
          <Typography color="textPrimary" align="center" variant="h3" gutterBottom style={{marginTop:'50px'}}>
            Node Scoreboard
          </Typography>
          <Typography color="textPrimary" align="center" variant="h5" gutterBottom style={{marginTop:'25px'}}>
                Track your weekly contest stats
              </Typography>
              <Grid container justify="center" spacing={3} style={{marginTop: '50px'}}>
            <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
              <Card className={classes.gridItem}>
                <CardContent style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: '5px', textAlign: 'center', color: '#000', fontSize: '18px' }}>Next Reset</h3>
                  <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to.toDate()} description="Next Reset" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
              <Card className={classes.gridItem}>
                <CardContent style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: '5px', textAlign: 'center', color: '#000', fontSize: '18px' }}>Your Points</h3>
                  <h2 style={{ fontWeight: 'lighter', display: 'flex', fontSize: '1.5rem', marginTop: '8px', justifyContent:'center' }}>
                    { userEntries && userEntries.length > 0 ? ( <>{userEntries[0].entries}</> ) : '-' } 
                    </h2>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
              <Card className={classes.gridItem}>
                <CardContent style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: '5px', textAlign: 'center', color: '#000', fontSize: '18px' }}>Current Leader</h3>
                  <h2 style={{ fontWeight: 'lighter', display: 'flex', fontSize: '1.5rem', marginTop: '8px', justifyContent:'center' }}>
                  { leaderboardData && leaderboardData.length > 0 ? (
                    <>{leaderboardData[0].entries}</>
                  ) : '-' }
                  </h2>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} md={2} lg={2}>
              <p style={{lineHeight: '5px'}}>&nbsp;</p>
              <Button 
                color= "primary"
                variant= "contained"
                className="shinyButtonSecondary"  
                style={{ 'width': '100%', marginTop:"40px" }} 
                component={Link}
                to={'/nodes-lottery'}
                >
                View leaderboard
              </Button>
            </Grid>
          </Grid>
              <InfoCards />
        </Route>
        <Route path={`${path}/:bankId`}>
          <SundaeNode />
        </Route>
        </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

export default SundaeNodes;
