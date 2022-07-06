import React, {useCallback, useEffect, useState} from 'react';
import { Container, Grid, Typography, Box } from '@material-ui/core';

import { ProfitDistributionInfo } from '../../../tomb-finance';

import { useWallet } from 'use-wallet';
import useParthenonTotaLProfitDistributionStat from "../../../hooks/parthenon/useParthenonTotaLProfitDistributionStat";
import Spacer from "../../../components/Spacer";
import CountUp from "react-countup";


interface ParthenonTotalRewardsProps {
    activeDistributions: ProfitDistributionInfo[];
}
const ParthenonTotalRewards: React.FC<ParthenonTotalRewardsProps> = ({  activeDistributions }) => {
    const { account } = useWallet();


    const [isDataLoaded, setDataLoaded] = useState(false); //Disable buttons while data loading
    const totalRewardsData = useParthenonTotaLProfitDistributionStat(activeDistributions, !isDataLoaded)
    const fetchData = async (): Promise<void> => {

        if( !account || totalRewardsData === undefined )
            return;
        setDataLoaded(true);

    };


    useEffect(() => {
        setDataLoaded(false);
        fetchData().then();
    }, [account, totalRewardsData]);


    return (
        <Grid item={true} xs={12}>
            <Container
                style={{
                    minHeight: '80px',
                    display: 'flex',
                    textAlign: 'center',
                    backgroundColor: 'rgba(46, 15, 3, 0.75)',
                    borderRadius: '20px',
                    border: '1px solid #DAC0AA',
                }}
            >
                <Box display={'flex'} justifyContent={'space-around'} alignItems={'center'} flexDirection={'column'} style={{width:'100%'}}>
                    <Spacer size={'md'} />
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} style={{width:'100%'}} >
                        <Typography variant={'h2'} color={'primary'} style={{fontWeight:'700', fontSize:'35px'}}>
                            TOTAL REWARDS EARNED
                        </Typography>
                    </Box>
                    <Spacer size={'md'} />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4} >
                            <Typography variant={'h5'} color={'primary'} style={{opacity:'0.8', fontWeight:'600'}}>TOTAL VALUE LOCKED</Typography>
                            <Typography variant={'h2'} color={'primary'} style={{fontSize:'30px'}}>
                                <CountUp end={totalRewardsData?.totalValueLocked ?? 0.00} separator="," prefix="$" />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} >
                            <Typography variant={'h5'} color={'primary'} style={{opacity:'0.8', fontWeight:'600'}}>DISTRIBUTED REWARDS </Typography>
                            <Typography variant={'h2'} color={'primary'} style={{fontSize:'30px'}}>
                                <CountUp end={totalRewardsData?.totalRewardsInDollars ?? 0.00} separator="," prefix="$" />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} >
                            <Typography variant={'h5'} color={'primary'} style={{opacity:'0.8', fontWeight:'600'}}>BURNED </Typography>
                            <Typography variant={'h2'} color={'primary'} style={{fontSize:'30px'}}>
                                <CountUp end={totalRewardsData?.allTokenAmountBurnedInDollars ?? 0.00} separator="," prefix="$" />
                            </Typography>
                        </Grid>
                    </Grid>
                    <Spacer size={'md'} />
                </Box>

            </Container>
        </Grid>
    );
};

export default ParthenonTotalRewards;
