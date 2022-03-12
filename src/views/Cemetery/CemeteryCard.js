import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardActions, CardContent, Typography, Grid } from '@material-ui/core';

import TokenSymbol from '../../components/TokenSymbol';

const CemeteryCard = ({ bank }) => {
  return (
    <Grid item xs={12} md={4} lg={4}>
      <Card variant="outlined" style={{ border: '1px solid var(--white)', backgroundColor: 'rgba(229, 152, 155, 0.1)', boxShadow: 'none', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-around' }} >
        <CardContent >
          <Box>
            <Box style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <Typography variant="h5" component="h2">
                {bank.depositTokenName}
              </Typography>
            </Box>

            <Box
              style={{
                height: '48px',
                borderRadius: '40px',
                backgroundColor: 'transparent',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '2em'
              }}
            >
              <TokenSymbol size={32} symbol={bank.depositTokenName} />
            </Box>

            <Box style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <Typography color="textSecondary">
                {/* {bank.name} */}
                Deposit {bank.depositTokenName.toUpperCase()} Earn {` ${bank.earnTokenName}`}
              </Typography>
              <Typography color="textSecondary">
                Multiplier: {bank.multiplier}
              </Typography>
            </Box>

          </Box>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button color="primary" size="small" variant="contained" target="_blank" href={`${bank.buyLink}`} style={{ backgroundColor: '#21ad8f' }}>
            Buy
          </Button>
          <Button color="primary" size="small" variant="contained" component={Link} to={`/farms/${bank.contract}`} style={{ backgroundColor: '#21ad8f' }}>
            Stake
          </Button>
        </CardActions>
      </Card>
    </Grid >
  );
};

export default CemeteryCard;
