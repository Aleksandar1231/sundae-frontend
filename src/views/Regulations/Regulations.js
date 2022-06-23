import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import useTombFinance from '../../hooks/useTombFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontSize: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#2c2560',
    fontWeight: 'bolder',
  },
  body: {
    fontSize: 14,
    color: '#2c2560',
  },
}))(TableCell);
const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: 'rgb(0,0,0)',
    },
  },
}))(TableRow);


// {getDisplayBalance(cashPrice, 18, 4)}

const Regulations = () => {
  const tombFinance = useTombFinance();
  const cashPrice = useCashPriceInLastTWAP();
  const classes = useStyles();
  const [rows, setRows] = useState(null);
  function createData(epoch, dao, dev, masonry, bondsBought, bondsRedeemed, price) {
    var sum = (Number(dao) + Number(dev) + Number(masonry)).toFixed(2);
    var price = Number(cashPrice.priceInDollars).toFixed(4); //assign price
    return { epoch, price, bondsBought, bondsRedeemed, sum };
  }
  useEffect(() => {
    if (tombFinance) {
      const thisData = tombFinance.listenForRegulationsEvents();
      thisData.then((elements) => {
        setRows(
          elements
            .reverse()
            .map((element) =>
              createData(
                element.epoch,
                element.price, //last price
                element.bondsBought,
                element.bondsRedeemed,
                element.sum, //sum of dao , dev and distribution
              ),
            ),
        );
      });
    }
  }, [tombFinance]);

  return (
    <Page>
       <Typography color="textPrimary" align="center" variant="h3" gutterBottom style={{marginTop:'50px'}}>
        Regulations
      </Typography>

      
      <Typography color="textPrimary" align="center" variant="h5" gutterBottom style={{marginTop:'25px'}}>
                The distribution of FUDGE during expansion and contraction
      </Typography>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table" style={{ marginTop: '75px' }}>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Epoch</StyledTableCell>
              <StyledTableCell align="center">Price</StyledTableCell>
              <StyledTableCell align="center">Redeem</StyledTableCell>
              <StyledTableCell align="center">Bond</StyledTableCell>
              <StyledTableCell align="center">Expand</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row, index) => (
              <StyledTableRow
                style={index % 2 ? { background: 'rgba(255,255,255,0.9)' } : { background: 'rgba(255,255,255,0.8)' }}
                key={row.epoch}
              >
                <StyledTableCell style={{ color: '#2c2560' }} align="center" component="th" scope="row">
                  {row.epoch}
                </StyledTableCell>
                <StyledTableCell align="center">{row.epoch}</StyledTableCell>
                <StyledTableCell align="center">{row.price}</StyledTableCell>
                <StyledTableCell align="center">{row.bondsBought}</StyledTableCell>
                <StyledTableCell align="center">{row.bondsRedeemed}</StyledTableCell>
                <StyledTableCell align="center">{row.sum}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Page>
  );
};

export default Regulations;
