import { useContext } from 'react';
import { Context as ProfitDistributionsContext } from '../contexts/ProfitDistributions';

const useProfitDistributions = () => {
    const { profitDistributions } = useContext(ProfitDistributionsContext);
    return [profitDistributions];
};

export default useProfitDistributions;
