import { useEffect, useState} from 'react';
import useFreezer from "../useFreezer";
import { ProfitDistributionStat} from "../../tomb-finance/types";

const useFreezerCalculateUserTax = (profitDistributionStat: ProfitDistributionStat) => {
    const [userTax, setUserTax] = useState<string>();
    const Freezer = useFreezer();

    useEffect(() => {
        async function calculateFreezerUserTax() {
            try {
                if( !Freezer || !profitDistributionStat )
                    return;
                setUserTax(await Freezer.calculateFreezerUserTax(profitDistributionStat));
            }
            catch(err){
                console.error(err);
            }
        }
        calculateFreezerUserTax().then();
    }, [setUserTax, Freezer, profitDistributionStat]);

    return userTax;
};

export default useFreezerCalculateUserTax;