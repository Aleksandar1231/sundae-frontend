import { ProfitDistributionInfo } from '../../../tomb-finance';
import React from 'react';
import {Box, Button, Grid, Typography, Container, useMediaQuery} from '@material-ui/core';
import CountUp from 'react-countup';
import ParthenonReward from './ParthenonReward';
import Slider from 'react-slick'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './slider.css'
import {useTheme} from "@material-ui/core/styles";

interface ParthenonRewardsBoxProps {
  rewards: number[];
  rewardPricesInDollars: number[];
  profitDistributionInfo: ProfitDistributionInfo;
  isDataLoaded: boolean;
  onClaim?: () => void;
}

const ParthenonRewardsBox: React.FC<ParthenonRewardsBoxProps> = ({
  rewards = [],
  rewardPricesInDollars = [],
  profitDistributionInfo,
  isDataLoaded,
  onClaim,
}) => {
  function calculatePrice(index: number): number {
    return rewards[index] * rewardPricesInDollars[index];
  }

  const theme = useTheme();
  const isMdSize = useMediaQuery(theme.breakpoints.down('sm'));

  var settings = {
    speed: 1000,
    autoplay: true,
    initialSlide: 0,
    rows: 1,
    waitForAnimate: true,
    arrows: true,
    swipe: true,
    vertical: false,

    responsive: [
      {
        breakpoint: 4000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: profitDistributionInfo.rewardTokensName.length / 2,
          infinite: profitDistributionInfo.rewardTokensName.length > 3,
          dots: true
        }
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: profitDistributionInfo.rewardTokensName.length > 3,
          dots: true,
        }
      },
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 4,
          slidesToScroll: profitDistributionInfo.rewardTokensName.length / 4,
          infinite: profitDistributionInfo.rewardTokensName.length > 3,
          dots: true
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: profitDistributionInfo.rewardTokensName.length/ 2,
          slidesToScroll: profitDistributionInfo.rewardTokensName.length / 2,
          infinite: profitDistributionInfo.rewardTokensName.length > 3,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: profitDistributionInfo.rewardTokensName.length /2,
          slidesToScroll: profitDistributionInfo.rewardTokensName.length / 2,
          infinite: profitDistributionInfo.rewardTokensName.length > 3,
          dots: true
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  };



  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}
      alignItems={'center'}
      style={{ height: '100%' }}
    >
      <Box mt={2} mb={2} display={'flex'} flexDirection={'row'} justifyContent={'center'}>
        <Typography color={'primary'} variant={'h4'}>
          Rewards: &nbsp;
        </Typography>
        <Typography color={'primary'} variant={'h4'}>
          <CountUp
            end={rewards.reduce((prevValue, curValue, index) => prevValue + curValue * rewardPricesInDollars[index], 0)}
            separator=","
            prefix="$"
            decimals={2}
          />
        </Typography>
      </Box>
      <Container>
          <Slider {...settings} >
            {profitDistributionInfo.rewardTokensName.map((reward, index) => (
                <React.Fragment key={reward?.contractName}>
                  <ParthenonReward
                      contractName={reward?.contractName}
                      price={isDataLoaded ? calculatePrice(index) : 0.0}
                      rewards={isDataLoaded ? rewards[index] : 0.0}
                  />
                </React.Fragment>
            ))}
          </Slider>
      </Container>
      <Box mb={2} mt={4}>
        <Button
          disabled={!isDataLoaded || profitDistributionInfo.close}
          style={{ margin: '0 auto' }}
          color="secondary"
          variant="contained"
          size="small"
          onClick={onClaim}
        >
          Claim
        </Button>
      </Box>
    </Box>
  );
};

export default ParthenonRewardsBox;
