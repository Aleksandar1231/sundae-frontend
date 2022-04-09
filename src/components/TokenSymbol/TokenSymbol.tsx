import React from 'react';

//Graveyard ecosystem logos
import tombLogo from '../../assets/img/fudge.png';
import tShareLogo from '../../assets/img/straw.png';
import tBondLogo from '../../assets/img/caraml.png'; // home page up
import tombLogoPNG from '../../assets/img/fudge.png';
import tShareLogoPNG from '../../assets/img/straw.png';
import wftmLogo from '../../assets/img/dai.png';
import twoshareLogo from '../../assets/img/cshare.png';
import twoombLogo from '../../assets/img/cream.png';
import TwoombLPLogo from '../../assets/img/cream-wavax.png';
import TwosharesLPLogo from '../../assets/img/cshare-avax.png';
import TwoombTwosharesLPLogo from '../../assets/img/creamcshare.png';
import wavaxLogo from '../../assets/img/wavax.png';
import tombFtmLpLogo from '../../assets/img/fudge-dai.png';
import tshareFtmLpLogo from '../../assets/img/straw-dai.png';
import ThreeombLPLogo from '../../assets/img/fudge-dai.png';
import ThreesharesLPLogo from '../../assets/img/straw-dai.png';
import fsLogo from '../../assets/img/fudge-straw.png';
import faLogo from '../../assets/img/fudge-avax.png';
import nodeLogo from '../../assets/img/node.png';
import fcLogo from '../../assets/img/fudge-cream.png';
import csLogo from '../../assets/img/cream-straw.png';
import saLogo from '../../assets/img/straw-avax.png';


const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  TOMBPNG: tombLogoPNG,
  TSHAREPNG: tShareLogoPNG,
  WFTM: wftmLogo,
  NODE:nodeLogo,
  'CREAM-AVAX LP': TwoombLPLogo,
  'CSHARE-AVAX LP': TwosharesLPLogo,
  'CREAM-CSHARE LP': TwoombTwosharesLPLogo,
  'CREAM': twoombLogo,
  'CSHARE': twoshareLogo,
  'TOMB': tombLogo,
  'TSHARE': tShareLogo,
  'TBOND': tBondLogo,
  'FUDGE-DAI LP': ThreeombLPLogo,
  'STRAW-DAI LP': ThreesharesLPLogo,
  'DAI': wftmLogo,
  'TOMB-FTM-LP': tombFtmLpLogo,
  'TSHARE-FTM-LP': tshareFtmLpLogo,
  'FUDGE': tombLogoPNG,
  'CARAML': tBondLogo,
  'STRAW': tShareLogo,
  'WAVAX': wavaxLogo,
  'FUDGE-STRAW LP':fsLogo,
  'FUDGE-AVAX LP':faLogo,
  'FUDGE-CREAM LP':fcLogo,
  'CREAM-STRAW LP':csLogo,
  'STRAW-AVAX LP':saLogo

};

type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({symbol}) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  if(symbol === 'TOMB' || symbol === 'TSHARE' || symbol === 'TBOND'  || symbol === 'FUDGE-DAI' || symbol === 'FUDGE-AVAX'){
    return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={80} height={80} />;
  } else if( symbol === 'FUDGE-DAI LP'|| symbol === 'STRAW-AVAX LP'){
    return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={90} height={90} />;
  }/* else if( symbol === 'CREAM'){
    return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={100} height={89} />;
  } */else if( symbol === 'CARAML' ||symbol === 'FUDGE'){
    return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={90} height={90} />;
  }else{
    return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={100} height={100} />;
  }
    
};

export default TokenSymbol;