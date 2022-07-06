import { useEffect, useState } from 'react';
import {ProfitDistributionInfo, ProfitDistributionStat} from '../../tomb-finance/types';
import useFreezer from "../useFreezer";

const useProfitDistributionStats = (profitDistribution: ProfitDistributionInfo, account: string) => {
    const [stat, setStat] = useState<ProfitDistributionStat>();
    const Freezer = useFreezer();

    useEffect(() => {
        async function fetchProfitDistributionStat() {
            try {
                if( !Freezer  )
                    return;
                setStat(await Freezer.getProfitDsitributionStat(profitDistribution, account));
            }
            catch(err){
                console.error(err);
            }
        }
        fetchProfitDistributionStat();
    }, [setStat, Freezer, account]);

    return stat;
};

export default useProfitDistributionStats;
