import { createContext } from 'react';
import { ProfitDistributionInfo } from '../../tomb-finance';

export interface ProfitDistributionsContext {
  profitDistributions: ProfitDistributionInfo[];
}

const context = createContext<ProfitDistributionsContext>({
  profitDistributions: [],
});

export default context;