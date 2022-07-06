import { useEffect, useState} from 'react';
import useFreezer from "../useFreezer";
import { ProfitDistributionStat} from "../../tomb-finance/types";

const useFreezerDepositFee = (profitDistributionStat: ProfitDistributionStat) => {
    const [depositFee, setDepositFee] = useState<number>();
    const Freezer = useFreezer();

    useEffect(() => {
        async function fetchFreezerDepositFee() {
            try {
                if( !Freezer || !profitDistributionStat )
                    return;
                setDepositFee(await Freezer.getFreezerDepositFee(profitDistributionStat));
            }
            catch(err){
                console.error(err);
            }
        }
        fetchFreezerDepositFee().then();
    }, [setDepositFee, Freezer, profitDistributionStat]);

    return depositFee;
};

export default useFreezerDepositFee;
