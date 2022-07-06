import React from 'react';
import { Grid, Box, Typography} from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import moment from 'moment'
import ProgressCountdown from '../../DashboardPage/components/ProgressCountdown'

import useCurrentEpoch from '../../../hooks/useCurrentEpoch'
import useTreasuryAllocationTimes from '../../../hooks/useTreasuryAllocationTimes'

const EpochBar: React.FC = () => {
    const currentEpoch = useCurrentEpoch()
    const { to } = useTreasuryAllocationTimes()

    return (
        <Grid container item xs={12} md={5} justifyContent="center" alignItems="center" spacing={1}
              style={{minHeight: '50px'}}>
            <Grid item xs={6} md={6}>
                <Box display="flex"
                     flexDirection="row"
                     alignItems="center"
                     style={{ border:'0px solid red', marginRight: '5px', float:'right'}}>
                    <WhiteTextTypography style={{marginRight:'5px'}} variant="h2">NEXT EPOCH:</WhiteTextTypography>
                    <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch"/>
                </Box>
            </Grid>
            <Grid item xs={6} md={6}>
                <Box display="flex"
                     alignItems="center"
                     style={{ textAlign:'center', margin: '0 auto',marginLeft: '5px', float:'left'}}>
                  <WhiteTextTypography style={{marginRight:'5px'}} variant="h2">CURRENT EPOCH:</WhiteTextTypography>
                  <WhiteTextTypography variant="h2">{Number(currentEpoch)}</WhiteTextTypography>
                </Box>
            </Grid>
        </Grid>
    );
}

const WhiteTextTypography = withStyles({
    root: {
      color: 'rgba(248, 242, 242, 1.0)',
      fontSize: '17px',
      textAlign: 'center',
      fontWeight: 500,
      fontFamily: 'Poppins'
    }
  })(Typography);

  export default EpochBar
