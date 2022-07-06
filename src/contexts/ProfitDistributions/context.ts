import { createContext } from 'react';
import { ProfitDistributionInfo } from '../../tomb-finance';

export interface ProfitDistributionsContext {
  profitDistributions: ProfitDistributionInfo[];
}

const Context = createContext<ProfitDistributionsContext>({
  profitDistributions: [],
});

export default Context;
