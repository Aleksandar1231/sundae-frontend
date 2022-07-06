import {useCallback, useEffect, useState} from 'react';
import useFreezer from "../useFreezer";
import {FreezerTotalPoolStat, ProfitDistributionInfo} from "../../tomb-finance/types";
import config from "../../config";

const useFreezerPoolStat = (activeProfitDistributions: ProfitDistributionInfo[], forceUpdate: boolean) => {
    const [decimal, setDecimal] = useState<FreezerTotalPoolStat>();
    const Freezer = useFreezer();


    const fetchBalance = useCallback(async () => {
        const balance = await Freezer.getFreezerTotalProfitStat(activeProfitDistributions);
        setDecimal(balance);
    }, [activeProfitDistributions, Freezer]);

    useEffect(() => {
        if (Freezer && forceUpdate) {
            fetchBalance().catch((err) => console.error(err.stack));

            const refreshBalance = setInterval(fetchBalance, config.refreshInterval / 3);
            return () => clearInterval(refreshBalance);
        }
    }, [ setDecimal, Freezer, fetchBalance, forceUpdate]);

    return decimal;
};

export default useFreezerPoolStat;