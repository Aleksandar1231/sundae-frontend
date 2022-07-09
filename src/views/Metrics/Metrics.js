import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import {
  Box,
  Grid,
  Table,
  Typography,
  TablePagination,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';

import Page from '../../components/Page';
import useTombFinance from '../../hooks/useTombFinance';

import PageHeader from '../../components/PageHeader';

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bolder',
    overflow: 'clip',
    backgroundColor: 'rgba(46, 15, 3, 0.45)',
    overflowX: 'clip',
    overflowY: 'clip',
  },
  body: {
    fontSize: 14,
    color: 'white',
    backgroundColor: 'rgba(46, 15, 3, 0.45)',
    minHeight: '100px',
    overflow: 'clip',
  },
}))(TableCell);
const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
  table: {
    borderRadius: '20px',
    overflow: 'clip',
  },
  pagination: {
    backgroundColor: 'rgba(46, 15, 3, 0.45)',
    padding: '2px',
    borderRadius: '15px',
  },
}));

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: 'rgb(0,0,0)',
    },
  },
}))(TableRow);

const Metrics = () => {
  const classes = useStyles();
  const tombFinance = useTombFinance();

  const [rows, setRows] = useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [page, setPage] = React.useState(0);
  const [totalEvents, setTotalEvents] = React.useState(0);

  function createData(epoch, dao, dev, masonry, bondsBought, bondsRedeemed) {
    var sum = (Number(dao) + Number(dev) + Number(masonry)).toFixed(2);
    return { epoch, dao, dev, masonry, sum, bondsBought, bondsRedeemed };
  }
  useEffect(() => {
    if (tombFinance) {
      setRows(null);

      const thisData = tombFinance.listenForRegulationsEvents(page, rowsPerPage);

      thisData.then((elements) => {
        const size = tombFinance.getEventsLength();
        setTotalEvents(size);
        setRows(
          elements
            .reverse()
            .map((element) =>
              createData(
                parseInt(element.epoch),
                parseInt(element.daoFund),
                parseInt(element.devFund) + parseInt(element.teamFund),
                parseInt(element.masonryFund),
                parseInt(element.bondsBought),
                parseInt(element.bondsRedeemed),
              ),
            ),
        );
      });
    }
  }, [tombFinance, page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  return (
    <Page>
      <Typography color="textPrimary" align="center" variant="h3" gutterBottom style={{marginTop:'50px'}}>
        Metrics
      </Typography>
      <Typography color="textPrimary" align="center" variant="h5" gutterBottom style={{marginTop:'25px', marginBottom:'75px'}}>
        Events recorded once an epoch has ended
      </Typography>
      <Grid
        container
        style={{
          border: '1px solid #DAC0AA',
          borderRadius: '20px',
          backgroundColor: 'rgba(46, 15, 3, 0.45)',
          overflow: 'clip',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress style={{ position: 'absolute', display: !rows ? '' : 'none', marginTop: '35px' }} />
        <Grid item xs={12}>
          <TableContainer>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Epoch</StyledTableCell>
                  <StyledTableCell align="center">Distributed by Masonry</StyledTableCell>
                  <StyledTableCell align="center">DAO fund</StyledTableCell>
                  <StyledTableCell align="center">TEAM fund</StyledTableCell>
                  <StyledTableCell align="center">Treasury Minted</StyledTableCell>
                  <StyledTableCell align="center">Bonds Bought</StyledTableCell>
                  <StyledTableCell align="center">Bonds Redeemed</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ minHeight: '100px', border: '0px solid blue' }}>
                {!rows ? (
                  <StyledTableRow style={{ backgroundColor: 'rgba(46, 15, 3, 0.0)', overflow: 'clip' }}>
                    <StyledTableCell align="center"></StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                    <StyledTableCell align="center" style={{ height: '150px' }}></StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                  </StyledTableRow>
                ) : null}
                {rows?.map((row, index) => (
                  <StyledTableRow
                    style={index % 2 ? { background: 'rgba(81,50,23,0.6)' } : { background: 'rgba(81,50,23,0.6)' }}
                    key={row.epoch}
                  >
                    <StyledTableCell style={{ color: 'white' }} align="center" component="th" scope="row">
                      {row.epoch}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.masonry}</StyledTableCell>
                    <StyledTableCell align="center">{row.dao}</StyledTableCell>
                    <StyledTableCell align="center">{row.dev}</StyledTableCell>
                    <StyledTableCell align="center">{parseInt(row.sum)}</StyledTableCell>
                    <StyledTableCell align="center">{row.bondsBought}</StyledTableCell>
                    <StyledTableCell align="center">{row.bondsRedeemed}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} style={{ minHeight: '50px' }}>
          <Box display={'flex'} justifyContent={'flex-end'} mt={1} mr={1} ml={1}>
            <Pagination
              className={classes.pagination}
              count={totalEvents ? Math.ceil(totalEvents / rowsPerPage) : 0}
              onChange={handleChangePage}
              variant="outlined"
              color="secondary"
            />
          </Box>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Metrics;
