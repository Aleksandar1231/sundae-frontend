import {useCallback, useEffect, useState} from 'react';
import useFreezer from "../useFreezer";
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';


const useProfitDistributionClaim = (profitDistributionName: string) => {
    const Freezer = useFreezer();
    const handleTransactionReceipt = useHandleTransactionReceipt();

    const handleClaim = useCallback(() => {
            handleTransactionReceipt(
                Freezer.profitDistributionClaim(profitDistributionName),
                `Claim from ${profitDistributionName}`,
            );
        },
        [Freezer, handleTransactionReceipt],
    );
    return { onRewardClaim: handleClaim };
};

export default useProfitDistributionClaim;
