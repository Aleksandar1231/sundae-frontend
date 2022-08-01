import React from 'react';
import CustomBtn from '../components/CustomBtn/CustomBtn';
import Loading from '../components/Loading/Loading';
import config from '../config';
import { Size } from '../types';
import { connectMetamask, switchToNetwork } from './ethereum';
import { Box, Button, CardActions, CardContent, Typography, Grid, Avatar } from '@material-ui/core';

interface IEthereumInteraction {
  wallet?: string;
  chain?: number | string;
  loaded: Boolean;
  loaderSize?: Size;
  loadingColor?: string;
  className?: string;
  connectButton?: React.ReactNode;
  chainSwitchButton?: React.ReactNode;
  noLoading?: boolean;
  ignoreChain?: boolean;
  children?: React.ReactNode;
}

export default function EthereumInteraction({
  wallet,
  chain,
  loaded,
  loaderSize = Size.lg,
  loadingColor = 'orange',
  className = '',
  connectButton,
  chainSwitchButton,
  noLoading,
  ignoreChain,
  children,
}: IEthereumInteraction): JSX.Element {
  const ConnectButton = () => {
    if (React.isValidElement(connectButton)) {
      return React.cloneElement(connectButton, { onClick: connectMetamask });
    }
    return connectButton;
  };

  const ChainSwitchButton = () => {
    if (React.isValidElement(chainSwitchButton)) {
      return React.cloneElement(chainSwitchButton, { onClick: switchToNetwork });
    }
    return chainSwitchButton;
  };

  return (
    <Grid item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {loaded || noLoading ? (
        wallet ? (
          chain === config.chainId || ignoreChain ? (
            children
          ) : chainSwitchButton ? (
            ChainSwitchButton()
          ) : (
            <CustomBtn onClick={switchToNetwork}>SWITCH TO AVALANCHE</CustomBtn>
          )
        ) : connectButton ? (
          ConnectButton()
        ) : (
          <CustomBtn onClick={connectMetamask}>CONNECT METAMASK</CustomBtn>
        )
      ) : (
        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading size={loaderSize} color={loadingColor} />
        </Grid>
      )}
    </Grid>
  );
}
