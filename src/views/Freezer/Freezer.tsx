import React, {useCallback, useRef, useState} from 'react';
import {createGlobalStyle} from "styled-components";
import {Container, Grid, ThemeProvider, Box, useMediaQuery} from '@material-ui/core';


import FreezerImage from "../../assets/img/Freezer.webp";

import useProfitDistributions from '../../hooks/useProfitDistribution';
import UnlockWallet from "../../components/UnlockWallet";
import {useWallet} from "use-wallet";
import Page from '../../components/Page';
import Spacer from "../../components/Spacer";
import PageHeader from "../../components/PageHeader";
import FreezerItem from "./components/FreezerItem";

import {createTheme, useTheme} from "@material-ui/core/styles";
import FreezerTotalRewards from "./components/FreezerTotalRewards";

const Freezer: React.FC = () => {
    const [profitDistributions] = useProfitDistributions();
    const activeDistributions = profitDistributions.filter((profit) => !profit.finished);
    const { account } = useWallet();
    const theme = useTheme();
    const isSmallSizeScreen = useMediaQuery(theme.breakpoints.down('xs'));

    return (
        <Page>
            <ThemeProvider theme={parthenonTheme}>
                {!!account ? (
                    <Container maxWidth="lg">
                        <Grid container spacing={3}>
                            <Grid container item xs={12} sm={12} justifyContent="center" alignItems="center">
                                <PageHeader icon={''} title="Freezer" subtitle="Earn a share of Athena's war spoils" />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid container item xs={12} sm={12} justifyContent="center" alignItems="center">
                                <FreezerTotalRewards activeDistributions={activeDistributions} />
                            </Grid>
                        </Grid>

                        <div hidden={activeDistributions.filter((profit) => profit.sectionInUI === 0).length === 0}>
                            <PageHeader
                                title=""
                                subtitle="DEPOSITS AND REWARDS ARE CURRENTLY PAUSED"
                                icon={''}
                            />
                            <Grid container spacing={3}>
                                {activeDistributions
                                    .filter((distribution) => distribution.sectionInUI === 0)
                                    .map((profitDistribution) => (
                                        <React.Fragment key={profitDistribution.name}>
                                            <FreezerItem profitDistribution={profitDistribution}/>
                                        </React.Fragment>
                                    ))}
                            </Grid>
                        </div>

                        <div hidden={activeDistributions.filter((profit) => profit.sectionInUI === 1).length === 0}>
                            <PageHeader
                                title="UI TEST BLOCK 1"
                                subtitle=""
                                icon={''}
                            />
                            <Grid container spacing={3}>
                                {activeDistributions
                                    .filter((distribution) => distribution.sectionInUI === 1)
                                    .map((profitDistribution) => (
                                        <React.Fragment key={profitDistribution.name}>
                                            <FreezerItem profitDistribution={profitDistribution} />
                                        </React.Fragment>
                                    ))}
                            </Grid>
                        </div>
                    </Container>
                ) : (
                    <UnlockWallet />
                )}
            </ThemeProvider>

        </Page>
    );
};

const parthenonTheme = createTheme({
    palette: {
        type: 'dark',
        text: {
            primary: '#ffffff',
        },
        primary: {
            main: '#ffffff',
        },
        secondary: {
            light: '#ffffff',
            main: '#A27E59',
            dark: '#D8B08C',
            contrastText: '#ffffff',
        },
        action: {
            disabledBackground: '#878787',
            active: '#000',
            hover: '#000',
            disabled: '#FBFFF2',
        },
    },
    typography: {
        fontFamily: ['"Poppins"', 'sans-serif'].join(','),
        fontSize: 15,
        h1: {
            fontSize: 50
        },
        h2:{
            fontWeight: 800,
            fontSize: 26
        },
        h3: {
            fontWeight: 800,
            fontSize: 22
        },
        h4: {
            fontWeight: 800,
            fontSize: 18
        },
        h5: {
            fontWeight: 600,
            fontSize: 15
        },
        h6: {
            fontWeight: 500,
            fontSize: 13
        },
        subtitle1: {
            fontWeight: 500,
            fontSize: 11
        }
    },
});

export default Freezer;