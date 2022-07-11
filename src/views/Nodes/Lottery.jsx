import { Box, CardContent, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useMatch } from 'react-router-dom';
import Page from '../../components/Page';
import { lotteries, moralisConfiguration } from '../../config';
import moment from 'moment/moment';
import { getLeaderboardTotal } from './util/getLeaderboardTotal';
import Card from '../../components/Card';



const Lottery = () => {
  const { path } = useMatch('/nodes-lottery');
  const [leaderboardData, setLeaderboardData] = useState(null);

  const from = moment('2022-07-10 12:00:00Z');
  const to = moment('2022-07-17 12:00:00Z');

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    // const params =  { };
    const Moralis = require('moralis/node');
    await Moralis.start({
      serverUrl: moralisConfiguration.serverUrl,
      appId: moralisConfiguration.appId,
    });

    setLeaderboardData(await getLeaderboardTotal(lotteries, from, to));
  };

  return (
    <Page>
        <Typography color="textPrimary" align="center" variant="h3" gutterBottom style={{marginTop:'50px'}}>
            Leaderboard
          </Typography>

          <Typography color="textPrimary" align="center" variant="h5" gutterBottom style={{marginTop:'25px'}}>
                Track total nodes purchased and points earned
              </Typography>
      <p style={{'textAlign': 'center', 'color': '#000'}}>
        The following leaderboard is based on the number of new nodes created within the period
      </p>
      <p style={{'textAlign': 'center', 'color': '#000', 'fontWeight': 'bold' }}>
        { from.format('DD-MM-YYYY') } to { to.format('DD-MM-YYYY') }
      </p>
      <Grid container spacing={3} style={{ marginTop: '50px' }}>
        {leaderboardData && (
          <Grid item xs={12} sm={12} md={12}>
            <Card variant="outlined">
              <CardContent>
                <Box style={{ position: 'relative' }}>
                  <Typography variant="h5" component="h2" style={{'textAlign': 'center', marginBottom:"20px"}}>
                    Sundae Nodes
                  </Typography>
                  <table style={{'width': '100%'}}>
                    <thead>
                    <tr>
                      <th>&nbsp;</th>
                      <th style={{ textAlign: 'left' }}>Wallet</th>
                      <th>FUDGE Node Points</th>
                      <th>LP Node Points</th>
                      <th>Total Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    {leaderboardData.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}.</td>
                        <td>{'0x...' + item.wallet.slice(-8)}</td>
                        <td style={{ textAlign: 'center' }}>{item.entries0}</td>
                        <td style={{ textAlign: 'center' }}>{item.entries1}</td>
                        <td style={{ textAlign: 'center' }}>{item.entries}</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Page>
  );
};

export default Lottery;
