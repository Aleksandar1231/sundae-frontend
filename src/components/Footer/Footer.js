import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, Link } from '@material-ui/core';
import TwitterImage from '../../assets/img/twitter.svg';
import GithubImage from '../../assets/img/github.svg';
import TelegramImage from '../../assets/img/telegram.svg';
import DiscordImage from '../../assets/img/discord.svg';
import YoutubeImage from '../../assets/img/youtube.svg';

const useStyles = makeStyles((theme) => ({
  footer: {
    position: 'absolute',
    bottom: '0',
    paddingTop: '15px',
    paddingBottom: '15px',
    width: '100%',
    color: 'black',
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
          <Typography variant="body2" style={{ color: "#fff" }} align="center">
              {'Copyright © IceCream x Sundae Finance '}
              {new Date().getFullYear()}
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center', marginTop: '10px' }}>
            <a
              href="https://twitter.com/icecreamfinance"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <img alt="twitter" src={TwitterImage} className={classes.img} />
            </a>
            <a
              href="https://github.com/icecreamfinancial"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <img alt="github" src={GithubImage} className={classes.img} />
            </a>
            <a href="https://t.me/icecreamfinance" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <img alt="telegram" src={TelegramImage} className={classes.img} />
            </a>
            {/*             <a
              href="https://www.youtube.com/results?search_query=2omb+finance"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <img alt="youtube" src={YoutubeImage} className={classes.img} />
            </a> */}
            <a href="https://discord.gg/icecream" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <img alt="discord" src={DiscordImage} className={classes.img} />
            </a>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
