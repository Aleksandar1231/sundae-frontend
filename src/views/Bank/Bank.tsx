import React, { useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';

import { useParams } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import { makeStyles } from '@material-ui/core/styles';

import { Box, Button, CardContent, Typography, Grid, Select, withStyles, MenuItem } from '@material-ui/core';
import Card from '../../components/Card';
import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import UnlockWallet from '../../components/UnlockWallet';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import useBank from '../../hooks/useBank';
import useStatsForPool from '../../hooks/useStatsForPool';
import useRedeem from '../../hooks/useRedeem';
import { Bank as BankEntity } from '../../tomb-finance';
import useTombFinance from '../../hooks/useTombFinance';
import useNodes from '../../hooks/useNodes';
import useNodeText from '../../hooks/useNodeText';
import { getDisplayBalance } from '../../utils/formatBalance';
import useClaimedBalance from '../../hooks/useClaimedBalance';
import useStakedBalance from '../../hooks/useStakedBalance';
import { Text } from '../../components/Text';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
  card: {
    backgroundColor: 'rgba(229, 152, 155, 0.1)',
    boxShadow: 'none',
    border: '1px solid var(--white)'
  }
}));

const Bank: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0));
  const classes = useStyles();
  const { bankId } = useParams();
  const bank = useBank(bankId);
  const [poolId, setPoolId] = useState(0);
  const LOCK_ID = 'LOCK_ID';

  const { account } = useWallet();
  const { getNodeText } = useNodeText();
  const { onRedeem } = useRedeem(bank);
  const statsOnPool = useStatsForPool(bank);
  const nodes = useNodes(bank.contract, bank.sectionInUI, account);
  const hasNodes = nodes.length > 0 && nodes.filter((x) => x.gt(0)).length > 0;
  const claimBalance = useClaimedBalance(bank.contract, bank.sectionInUI, account);
  const maxPayout = useStakedBalance(bank.contract, bank.poolId, bank.sectionInUI, account).mul(4);
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const isMobile = width <= 768
  const nodeStartTime = 0;
  const isNodeStart = bank.sectionInUI !== 3 || Date.now() / 1000 >= nodeStartTime;

  const handleChangeLockup = (event: any) => {
    const value = event.target.value;
    setPoolId(Number(value));
    bank.poolId = Number(value);
    localStorage.setItem(LOCK_ID, String(value))
  }

  useEffect(() => {
    const poolId = localStorage.getItem(LOCK_ID)
    if (bank.sectionInUI === 3 && poolId) {
      setPoolId(Number(poolId));
      bank.poolId = Number(poolId);
    }
  });

  return account && bank && isNodeStart ? (
    <>
      <PageHeader
        icon="🏦"
        subtitle={bank.sectionInUI !== 3
          ? `Deposit ${bank?.depositTokenName} and earn ${bank?.earnTokenName}`
          : `Purchase nodes to generate FUDGE`
        }
        title={bank?.name}
      />
      <Box>
        <Grid container justify="center" spacing={3} style={{ marginBottom: '50px' }}>
          {bank.sectionInUI === 3 &&
            <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
              <Card >
                <CardContent style={{ textAlign: 'center', alignItems: 'center', display:'flex', flexDirection:'column' }}>
                  <Typography>Node Type</Typography>
                  <Select variant='outlined' onChange={handleChangeLockup} style={{ height: '2.5rem', color: '#1d48b6', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', marginBottom: '-16px' }} labelId="label" id="select" value={poolId}>
                    <StyledMenuItem value={0}>{getNodeText(0)}</StyledMenuItem>
                    <StyledMenuItem value={1}>{getNodeText(1)}</StyledMenuItem>
                    <StyledMenuItem value={2}>{getNodeText(2)}</StyledMenuItem>
                  </Select>
                </CardContent>
              </Card>
            </Grid>
          }

          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card>
              <CardContent style={{ textAlign: 'center', boxShadow: 'none !important' }}>
                <Typography>APR</Typography>
                <Typography>{bank.closedForStaking ? '0.00' : statsOnPool?.yearlyAPR}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card >
              <CardContent style={{ textAlign: 'center' }}>
                <Typography>Daily APR</Typography>
                <Typography>{bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card >
              <CardContent style={{ textAlign: 'center' }}>
                <Typography>TVL</Typography>
                <Typography>${statsOnPool?.TVL}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Box mt={5}>
        <StyledBank>
          <StyledCardsWrapper>
            <StyledCardWrapper>
              <Harvest bank={bank} />
            </StyledCardWrapper>
            <Spacer />
            <StyledCardWrapper>{<Stake bank={bank} />}</StyledCardWrapper>
          </StyledCardsWrapper>

          {bank.sectionInUI !== 3 && <Spacer size="lg" />}
          {bank.depositTokenName.includes('LP') && <LPTokenHelpText bank={bank} />}
          <Spacer size="lg" />
          {bank.sectionInUI !== 3 ?
            <div>
              <Button onClick={onRedeem} className="shinyButtonSecondary">
                Claim &amp; Withdraw
              </Button>
            </div>
            :
            hasNodes ?
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                <Card >
                  <CardContent>
                    <StyledTitle>Nodes</StyledTitle>
                    {nodes.map((num, id) => {
                      return num.gt(0)
                        ?
                        <Text style={{ display: 'flex', fontSize: '1rem', marginTop: '8px' }} key={id}>
                          <b style={{ color: 'rgb(29, 72, 182)', marginRight: '8px' }}>
                            {num.toString()}x
                          </b>
                          <div>
                            {getNodeText(id)}{num.gt(1) ? 's' : ''}
                          </div>
                        </Text>
                        : null;
                    })}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <StyledTitle>Claimed</StyledTitle>
                    <Text style={{ fontSize: '1rem', marginTop: '8px' }}>
                      {getDisplayBalance(claimBalance, 18, 2)} FUDGE
                    </Text>
                  </CardContent>
                </Card>
                <Card >
                  <CardContent>
                    <StyledTitle>Max Payout</StyledTitle>
                    <Text style={{ fontSize: '1rem', marginTop: '8px' }}>
                      {getDisplayBalance(maxPayout, 18, 0)} FUDGE
                    </Text>
                  </CardContent>
                </Card>

              </div>
              : null

          }
          <Spacer size="lg" />
        </StyledBank>
      </Box>
    </>
  ) : !bank ? (
    <BankNotFound />
  ) : (
    <UnlockWallet />
  );
};

const LPTokenHelpText: React.FC<{ bank: BankEntity }> = ({ bank }) => {
  const tombFinance = useTombFinance();
  const tombAddr = tombFinance.TOMB.address;
  const tshareAddr = tombFinance.TSHARE.address;

  let pairName: string;
  let uniswapUrl: string;
  if (bank.depositTokenName === ('FUDGE-DAI')) {
    pairName = 'FUDGE-DAI pair';
    uniswapUrl = 'https://traderjoexyz.com/pool/0xd586E7F844cEa2F87f50152665BCbc2C279D8d70/' + tombAddr;
  } else if (bank.depositTokenName === ('FUDGE-STRAW')) {
    pairName = 'FUDGE-STRAW pair';
    uniswapUrl = 'https://traderjoexyz.com/pool/' + tshareAddr + tombAddr;
  } else if (bank.depositTokenName === ('FUDGE')) {
    pairName = 'FUDGE stake';
    uniswapUrl = 'https://traderjoexyz.com/pool/' + tombAddr;
  } else {
    pairName = 'STRAW-AVAX pair';
    uniswapUrl = 'https://traderjoexyz.com/pool/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7/' + tshareAddr;
  }
  return (
    <Card>
      <CardContent>
        <StyledLink href={uniswapUrl} target="_blank">
          {`🍨 Provide liquidity for ${pairName} now on TraderJoe 🍨`}
        </StyledLink>
      </CardContent>
    </Card>
  );
};

const BankNotFound = () => {
  return (
    <Center>
      <PageHeader icon="🏚" title="Not Found" subtitle="You've hit a bank just robbed by unicorns." />
    </Center>
  );
};

const StyledBank = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: ${(props) => props.theme.color.primary.main};
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

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const StyledTitle = styled.h1`
  color: '#1d48b6';
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  padding: 0;
`;

const StyledOutline = styled.div`
  background: #1d48b6;
  background-size: 300% 300%;
  border-radius: 0px;
  filter: blur(8px);
  position: absolute;
  top: -6px;
  right: -6px;
  bottom: -6px;
  left: -6px;
  z-index: -1;
`;

const StyledOutlineWrapper = styled.div`    
    position: relative;
    background: #08090d;
    border-radius: 0px;
    box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05)
`;

const StyledMenuItem = withStyles({
  root: {
    backgroundColor: '#08090d',
    color: '#dddfee',
    textAlign: 'center',
    '&:hover': {
      backgroundColor: 'black',
      color: '#1d48b6',
    },
    selected: {
      backgroundColor: 'white',
    },
  },
})(MenuItem);

export default Bank;
