import React, {useMemo} from 'react';

import {Card, CardContent, Container, Grid, Box, Button, Typography} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import TokenSymbol from '../../../components/TokenSymbol';
import useTombFinance from '../../../hooks/useTombFinance';
import {makeStyles} from "@material-ui/core/styles";

interface ParthenonRewardProps {
    contractName: string;
    price: number;
    rewards: number;
}

const useStyles = makeStyles((theme) => ({
    mainBox: {
        justifyContent: 'center',
        overflow: 'hidden',
        textOverflow: 'clip',
        border: '1px solid rgba(216,176,140,0.4)',
        borderRadius: '5px'
        // '&:hover': {
        //   border: '1px solid gold',
        // }
    }
}));

const ParthenonReward: React.FC<ParthenonRewardProps> = ({contractName, price, rewards}) => {
    const basedFinance = useBasedFinance();
    const classes = useStyles();

    return (
        <Box display={'flex'} alignContent={'center'} justifyContent={'center'}
             style={{width: '100px', height: '100%'}}>
            <Box
                display="flex"
                flexDirection="row"
                alignContent={'center'}
                className={classes.mainBox}
            >
                <Box justifyContent={'center'} alignContent={'center'} flexDirection={'row'}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Tooltip PopperProps={{disablePortal: true}} placement="bottom" title={contractName}
                                 aria-label="Solid">
                            <Button
                                onClick={() => {
                                    basedFinance.watchAssetInMetamask(contractName).then();
                                }}
                                color="secondary"
                                variant="text"
                            >
                                <TokenSymbol size={40} symbol={contractName}/>
                            </Button>
                        </Tooltip>

                        <Typography color={'primary'} variant={'h6'}>
                            {rewards ? rewards.toFixed(2) : '0.00'}
                        </Typography>
                        <div>
                            <Typography color={'primary'} variant={'subtitle1'}>
                                (${price ? price.toFixed(2) : '0.00'})
                            </Typography>
                        </div>
                    </Box>
                </Box>

            </Box>
        </Box>
    );
};

export default ParthenonReward;
