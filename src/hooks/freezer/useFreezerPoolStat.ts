import { useEffect, useState} from 'react';
import useFreezer from "../useFreezer";
import {FreezerPoolStat, ProfitDistributionInfo, ProfitDistributionStat} from "../../tomb-finance/types";

const useFreezerPoolStat = (profitDistributionStat: ProfitDistributionStat, profitDistributionInfo: ProfitDistributionInfo) => {
    const [poolStat, setPoolStat] = useState<FreezerPoolStat>();
    const Freezer = useFreezer();

    useEffect(() => {
        async function fetchFreezerPoolStat() {
            try {
                if( !Freezer || !profitDistributionStat || !profitDistributionInfo )
                    return;
                setPoolStat(await Freezer.getFreezerPoolStat(profitDistributionStat, profitDistributionInfo));
            }
            catch(err){
                console.error(err);
            }
        }
        fetchFreezerPoolStat().then();
    }, [setPoolStat, Freezer, profitDistributionStat, profitDistributionInfo]);

    return poolStat;
};

export default useFreezerPoolStat;
