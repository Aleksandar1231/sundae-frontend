import { BigNumber } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Size } from '../LastManStanding/types';
import { Box, Button, CardActions, CardContent, Typography, Grid, Avatar } from '@material-ui/core';
import Card from '../../components/Card';

interface ICountdown {
  period: BigNumber;
  start: BigNumber;
  text: string;
  bg: string;
  bgLight: string;
  size?: Size;
  labelColor?: string;
  className?: string;
}

interface TimeDisplay {
  time: string;
  name: string;
}

interface Countdown {
  hours: TimeDisplay;
  minutes: TimeDisplay;
  seconds: TimeDisplay;
}

export default function Countdown({
  period,
  start,
  text,
  bg,
  bgLight,
  size = Size.lg,
  labelColor = 'text-black',
  className = '',
}: ICountdown): JSX.Element {
  const [countdown, setCountdown] = useState<Countdown>();
  const [countdownInterval, setCoundownInterval] = useState();

  const getRemainingTime = (remainingSeconds: number): Countdown => {
    const h = Math.floor(remainingSeconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((remainingSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor((remainingSeconds % 3600) % 60)
      .toString()
      .padStart(2, '0');

    const hDisplay = h === '01' ? 'Hour' : 'Hours';
    const mDisplay = m === '01' ? 'Minute' : 'Minutes';
    const sDisplay = s === '01' ? 'Second' : 'Seconds';
    return {
      hours: { time: h, name: hDisplay },
      minutes: { time: m, name: mDisplay },
      seconds: { time: s, name: sDisplay },
    };
  };

  const getRemainingSeconds = (start: BigNumber): number =>
    start?.add(period || 0)?.toNumber() - Math.round(Date.now() / 1000);

  useEffect(() => {
    if (countdownInterval !== undefined) clearInterval(countdownInterval);

    const interval: any = setInterval(() => {
      const remainingSeconds = getRemainingSeconds(start);
      if (remainingSeconds <= 0) {
        setCountdown(getRemainingTime(0));
        clearInterval(interval);
        clearInterval(countdownInterval);
      } else {
        setCountdown(getRemainingTime(remainingSeconds));
      }
    }, 1000);
    setCoundownInterval(interval);
    return () => clearInterval(interval);
  }, [start, period]);

  const displayTime = (time: React.ReactNode, i?: number) => {
    if (i % 2 === 0) {
      const unit = i === 0 ? 'hours' : i === 2 ? 'minutes' : i === 4 ? 'seconds' : '';
      const full = {
        hours: period?.toNumber() / 3600,
        minutes: 60,
        seconds: 60,
      };
      const ratio = 1 - parseInt(countdown?.[unit]?.time) / full?.[unit];

      return (
        <Grid style={{ height: '40px' }}>
          <Avatar
            variant="rounded"
            style={{
              width: 'calc(100% - 4px)',
              height: 'calc(100% - 4px)',
              backgroundColor: 'rgb(251 230 232)',
            }}
          >
            {time}
          </Avatar>
        </Grid>
      );
    }
  };

  return (
    <Grid style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
      {[countdown?.hours, ':', countdown?.minutes, ':', countdown?.seconds].map((item: any, i: number) => {
        return (
          <Grid key={i.toString()}>
            {i % 2 === 0 ? (
              <>
                {displayTime(
                  <span className={`${size === Size.lg ? 'text-20 sm:text-24' : 'text-12'} font-semibold ${text}`}>
                    {isNaN(item?.time) ? '-' : item?.time}
                  </span>,
                  i,
                )}

                <Grid style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
                  <span
                    className={`text-center ${labelColor} ${size === Size.lg ? 'text-16' : 'text-12'} ${
                      !item && 'invisible'
                    }`}
                  >
                    {item?.name || '.'}
                  </span>
                </Grid>
              </>
            ) : (
              <Grid style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
                <span className={`${labelColor} ${size === Size.lg ? 'text-xl sm:text-3xl' : 'text-12'} font-bold`}>
                  :
                </span>
              </Grid>
            )}
          </Grid>
        );
      })}
    </Grid>
  );
}
