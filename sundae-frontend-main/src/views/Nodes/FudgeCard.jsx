import React from 'react';
import {Link} from 'react-router-dom';
import {Box, Button, CardActions, CardContent, Typography, Grid} from '@material-ui/core';
import TokenSymbol from '../../components/TokenSymbol';
import useBank from '../../hooks/useBank';
import Card from '../../components/Card';
import useStatsForPool from '../../hooks/useStatsForPool';
const FudgeCard = ({}) => {
  const tombBank = useBank('FudgeNode');
  const statsOnPool = useStatsForPool(tombBank);
  return (
    <Grid item xs={12} md={4} lg={4}>
      <Card >
        <CardContent style={{ position: 'relative', backgroundColor: 'white' }}>
            <Grid style={{ display: 'flex', margin: '10px',justifyContent: "space-between" }}>
                <Grid>
                    <TokenSymbol symbol={"NODE"} />
                </Grid>
                <Grid mt={2} mb={4} >
                    <Box>
                    <h2 style={{ marginBottom: '10px', color: 'black', textAlign:'right' }}>{"Fudge Node"}</h2>
                    <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right' }}>
                        <h3 style={{ marginBottom: '10px', color: 'black' }}>{"Earn: FUDGE"}</h3>
                    </div>
                    </Box>
                </Grid>

            {/* <Typography color="#322f32">
              Lock your FUDGE to earn daily yields<br></br>
              <b>Daily APR:</b> {statsOnPool?.dailyAPR}%<br></br>
              <b>Yearly APR:</b> {statsOnPool?.yearlyAPR}%
            </Typography> */}
            </Grid>
            <hr style={{
            color: '#D3D3D3',
            backgroundColor: '#D3D3D3',
            height: 1
            }} />
           <Grid style={{ display: 'flex', marginBottom: '5px', marginTop: '10px', justifyContent: "space-between" }}>
            <h3 style={{ marginBottom: '10px', color: 'black' }}>Daily ROI:</h3>
            <h4 style={{ color: 'black' }}>{statsOnPool?.dailyAPR}%</h4>
          </Grid>
          <Grid style={{ display: 'flex', marginBottom: '5px', marginTop: '10px', justifyContent: "space-between" }}>
            <h3 style={{ marginBottom: '10px', color: 'black' }}>APR:</h3>
            <h4 style={{ color: 'black' }}>{statsOnPool?.yearlyAPR}%</h4>
          </Grid>
          <Grid style={{ display: 'flex', marginBottom: '5px', marginTop: '10px', justifyContent: "space-between" }}>
            <h3 style={{ marginBottom: '10px', color: 'black' }}>Total Value Locked:</h3>
            <h4 style={{ color: 'black' }}>${statsOnPool?.TVL}</h4>
          </Grid>
        </CardContent>
        <CardActions style={{ display: 'flex', justifyContent: 'space-evenly', marginBottom:'5px'}}>
        <Button 
          color= "primary"
          variant= "contained"
          className="shinyButtonSecondary" 
          href="https://app.bogged.finance/avax/swap?tokenIn=0xd586E7F844cEa2F87f50152665BCbc2C279D8d70&tokenOut=0xD9FF12172803c072a36785DeFea1Aa981A6A0C18"
          rel="noopener noreferrer"
          target="_blank"
          >
            Buy Token
          </Button>
          <Button 
          color= "primary"
          variant= "contained"
          className="shinyButtonSecondary" 
          href="https://icecreamfinancial.gitbook.io/sundae-finance/understanding-the-protocol/nodes"
          rel="noopener noreferrer"
          target="_blank"
          >
            Docs
          </Button>
          <Button 
          color= "primary"
          variant= "contained"
          className="shinyButtonSecondary" 
          component={Link} 
          to={'/nodes/FudgeNode'}
          >
            View
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default FudgeCard;
