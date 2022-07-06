import React from 'react';
import { Grid, Box, GridSize} from '@material-ui/core';
import styled from 'styled-components';

import TokenSymbol from '../../../components/TokenSymbol';

interface ICurseProps {
    xs: GridSize
    imageName: string
    firstVal: string
    valueType: string
    secondVal: string
  }

const CurseItem: React.FC<ICurseProps> = (props) => {
    const tokenDefaultSize: number = 52;
    return (
        <Grid item xs={props.xs} sm={4}>

            <Grid container direction="row"
            justifyContent="center"
            alignItems="center"
            >
                <Grid item xs={2} md={3} >
                    <Box style={{float:'right'}} >
                        <TokenSymbol symbol={props.imageName}  size={tokenDefaultSize}/>
                    </Box>
                </Grid>
                <Grid item  xs={4} md={6} >
                        <Box style={{ textAlign:'center'}}>
                            <StyledValue fontSize="15px" color="rgba(248, 242, 242, 1.0)">
                                {props.firstVal ? props.firstVal : '-.----'} {props.valueType}
                            </StyledValue>
                        </Box>
                        <Box style={{ textAlign:'center'}}>
                            <StyledValue fontSize="14px" color="rgba(248, 242, 242, 1.0)">
                                ${props.secondVal ? props.secondVal : '-.--'}
                            </StyledValue>
                        </Box>
                </Grid>
             </Grid>
        </Grid>
    );
};

interface ValueProps {
    fontSize: string;
}

export const StyledValue = styled.p<ValueProps>`
font-size: ${(props) => props.fontSize};
font-family: ['"Poppins"', 'sans-serif'];
color:  ${(props) => props.color};
font-weight: 500;
align-content: center;
margin: 0 0 0 0;
`;

export default CurseItem
