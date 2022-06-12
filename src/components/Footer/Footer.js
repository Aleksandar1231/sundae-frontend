import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, Link } from '@material-ui/core';

import { ReactComponent as IconTelegram } from '../../assets/img/telegram.svg';
import { ReactComponent as IconTwitter } from '../../assets/img/twitter.svg';
import { ReactComponent as IconGithub } from '../../assets/img/github.svg';
import { ReactComponent as IconDiscord } from '../../assets/img/discord.svg';
import { ReactComponent as IconGitbook } from '../../assets/img/gitbooklite.svg';
import kycLogo from '../../assets/img/ASSURE.png';

const useStyles = makeStyles((theme) => ({
  footer: {
    position: 'absolute',
    bottom: '0',
    paddingTop: '15px',
    paddingBottom: '15px',
    width: '100%',
    color: '#000',
    backgroundColor: 'transparent',
    textAlign: 'center',
    height: '1.3rem',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  link: {
    width: '24px',
    height: '24px',
    display: 'inline',
    marginLeft: '20px',
  },

  img: {
    width: '24px',
    height: '24px',
  },
  elipse: {
    position: 'absolute',
    width: '80px',
    height: '80px',
    left: '1700px',
    top: '-100px',

  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={12}>
          <Typography variant="body2" style={{ color: "#000" }} align="center">
              {'Copyright © IceCream x Sundae Finance '}
              {new Date().getFullYear()}
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center', marginTop: '10px', marginBottom:'10px' }}>
            <a
              href="https://twitter.com/icecreamfinance"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <IconTwitter style={{ fill: '#000 !important' }} />
            </a>
            <a
              href="https://github.com/icecreamfinancial"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
             <IconGithub style={{ fill: '#000 !important', height: '20px' }} />
            </a>
            <a href="https://t.me/icecreamfinance" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <IconTelegram style={{ fill: '#000 !important', height: '20px' }} />
            </a>
              {/* <a
              href="https://www.youtube.com/results?search_query=2omb+finance"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <img alt="youtube" src={YoutubeImage} className={classes.img} />
            </a> */}
            <a href="https://discord.gg/Z9wrNDUDa9" rel="noopener noreferrer" target="_blank" className={classes.link}>
            <IconDiscord style={{ fill: '#000 !important', height: '20px' }} />
            </a>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
