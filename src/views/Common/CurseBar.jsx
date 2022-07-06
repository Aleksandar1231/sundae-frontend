import React, { useMemo } from 'react';
import { Grid } from '@material-ui/core';

import usebShareStats from '../../../hooks/usebShareStats';
import useBasedStats from '../../../hooks/useBasedStats';
import useBondStats from '../../../hooks/useBondStats';

import CurseItem from './CurseItem';

const CurseBar = () => {
    const bShareStats = usebShareStats();
    const basedStats = useBasedStats();
    const bBondStats = useBondStats();
  
    const bSharePriceInDollars = useMemo(
        () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
        [bShareStats],
      );
      const bSharePriceInFTM = useMemo(
        () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(2) : null),
        [bShareStats],
      );
      const basedPriceInDollars = useMemo(
        () => (basedStats ? Number(basedStats.priceInDollars).toFixed(2) : null),
        [basedStats],
      );
      const basedPriceInTOMB = useMemo(() => (basedStats ? Number(basedStats.tokenInTomb).toFixed(2) : null), [basedStats]);
    
      const bBondPriceInDollars = useMemo(
        () => (bBondStats ? Number(bBondStats.priceInDollars).toFixed(2) : null),
        [bBondStats],
      );
      const bBondPriceInTOMB = useMemo(() => (bBondStats ? Number(bBondStats.tokenInTomb).toFixed(2) : null), [bBondStats]);
    
    return (
            <Grid container item xs={12} sm={12} md={7}
              direction="row"
            >
                {/*} For mobile versions, place the first element as a single element {*/}
                <CurseItem imageName={"BASED"} firstVal={basedPriceInTOMB} secondVal={basedPriceInDollars} valueType={"TOMB"} xs={6}/>
                <CurseItem imageName={"BSHARE"} firstVal={bSharePriceInFTM} secondVal={bSharePriceInDollars} valueType={"FTM"} xs={6}/>
                <CurseItem imageName={"BBOND"} firstVal={bBondPriceInTOMB} secondVal={bBondPriceInDollars} valueType={"TOMB"} xs={12}/>
            </Grid>
    );
 };

 export default CurseBar
