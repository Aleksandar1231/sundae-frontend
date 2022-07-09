import React, { useMemo } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@material-ui/core';

import ListItemLink from '../ListItemLink';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AccountButton from './AccountButton';
const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    color: 'var(--white)',
    'background-color': 'transparent!important',
    'backdrop-filter': 'blur(10px)',
    padding: '0 10px',
    position: 'sticky',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  hide: {
    display: 'none',
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    fontFamily: '"Gilroy"',
    fontSize: '30px',
    flexGrow: 1,
  },
  link: {
    textTransform: 'uppercase',
    color: 'var(--white)',
    fontSize: '18px',
    marginTop: '15px',
    margin: theme.spacing(10, 1, 1, 2),
    textDecoration: 'none',

  },
  brandLink: {
    textDecoration: 'none',
    color: '#000',
    alignItems:'left',
  },
}));

const Nav = () => {
  const matches = useMediaQuery('(min-width:900px)');
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <AppBar position="sticky" elevation={0} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {matches ? (
          <>
            <Typography  variant="h5" color="inherit" noWrap className='toolbar-title'>
              Sundae Finance
            </Typography>
            <Box mr={5}>
              <Link color="color" to="/" className='nav-link'>
                Home
              </Link>
              <Link color="textPrimary" to="/farms" className='nav-link'>
                Farm
              </Link>
              <Link color="textPrimary" to="/boardroom" className='nav-link'>
                Boardroom
              </Link>
              <Link color="textPrimary" to="/bonds" className='nav-link'>
                Bonds
              </Link>
              <Link color="textPrimary" to="/nodes" className='nav-link'>
                Nodes
              </Link>
              <Link color="textPrimary" to="/lastmanstanding" className='nav-link'>
                Last-Man-Standing
              </Link>
             <Link color="textPrimary" to="/metrics" className='nav-link'>
                Metrics
              </Link>
              <a href="https://froyo.farm/#/avax" target="_blank" className='nav-link'>
                Vaults
              </a>
             {/*  <a href="" target="_blank" className='nav-link'>
                Social Club
              </a> */}
              <a href="https://icecreamfinancial.gitbook.io/sundae-finance/" target="_blank" className='nav-link'>
                Docs
              </a>
              <a href="https://icecreamfinance.app" target="_blank" className='nav-link'>
                IceCream
              </a>
            </Box>

            <AccountButton text="Connect" />
          </>
        ) : (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Sundae Finance
            </Typography>

            <Drawer
              className={classes.drawer}
              variant="temporary"
              anchor="left"
              open={open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </div>
              <Divider />
              <List>
                <ListItemLink primary="Home" to="/" />
                <ListItemLink primary="Farm" to="/farms" />
                <ListItemLink primary="Boardroom" to="/boardroom" />
                <ListItemLink primary="Bonds" to="/bonds" />
                 <ListItemLink primary="Nodes" to="/nodes" /> 
                 <ListItemLink primary="Last Man Standing" to="/lastmanstanding" /> 
                <ListItem button component="a" href="https://froyo.farm/#/avax">
                  <ListItemText disableTypography style={{ color: '#000' }}>
                    Vaults
                  </ListItemText>
                </ListItem>
{/*                 <ListItem button component="a" href="">
                  <ListItemText disableTypography style={{ color: '#FFFFFF' }}>
                    Social Club
                  </ListItemText>
                </ListItem> */}
                <ListItem button component="a" href="">
                  <ListItemText disableTypography style={{ color: '#000' }}>
                    Docs
                  </ListItemText>
                </ListItem>
                <ListItem button component="a" href="https://icecreamfinance.app">
                  <ListItemText disableTypography style={{ color: '#000' }}>
                    IceCream Finance
                  </ListItemText>
                </ListItem>
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
