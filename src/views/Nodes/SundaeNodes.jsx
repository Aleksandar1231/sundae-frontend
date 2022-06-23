import {Grid, Typography} from '@material-ui/core';
import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import Page from '../../components/Page';
import SundaeNode from '../SundaeNode';
import FudgeCard from './FudgeCard';
import UnlockWallet from '../../components/UnlockWallet';
import { useWallet } from 'use-wallet';




const SundaeNodes = () => {
  const {path} = useRouteMatch();
  const { account } = useWallet();
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
