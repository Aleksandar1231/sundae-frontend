import React, { useCallback, useEffect, useState } from 'react';
import Context from './context';
import useTombFinance from '../../hooks/useTombFinance';
import { ProfitDistributionInfo } from '../../tomb-finance';
import  { profitDistributionDefinitions } from '../../views/Freezer/profitConfig';

const ProfitDistributions: React.FC = ({ children }) => {
    const [profitDistributions, setProfits] = useState<ProfitDistributionInfo[]>([]);
    const tombFinance = useTombFinance();
    const isUnlocked = tombFinance?.isUnlocked;

    const fetchPools = useCallback(async () => {
        const profitDistributions: ProfitDistributionInfo[] = [];

        for (const profInfo of Object.values(profitDistributionDefinitions)) {
            if (profInfo.finished) {
                if (!tombFinance.isUnlocked) continue;
            }

            profitDistributions.push({
                ...profInfo,
            });
        }
        profitDistributions.sort((a, b) => (a.sort > b.sort ? 1 : -1));
        setProfits(profitDistributions);
    }, [tombFinance, setProfits]);

    useEffect(() => {
        if (tombFinance) {
            fetchPools().catch((err) => console.error(`Failed to fetch pools: ${err.stack}`));
        }
    }, [isUnlocked, tombFinance, fetchPools]);

    return <Context.Provider value={{ profitDistributions }}>{children}</Context.Provider>;
};

export default ProfitDistributions;