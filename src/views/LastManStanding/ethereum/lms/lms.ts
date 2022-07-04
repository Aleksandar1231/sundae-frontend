import { BigNumber, utils } from "ethers";
import config from "../../config";
import { Symbol } from "../../types";
import { getContract, parseBigNumber, _getProvider } from "../ethereum";
import kocAbi from "./lmsAbi";

const contracts = {};
for (const [key, value] of Object.entries(config.koc)) {
    contracts[key] = value ? getContract(value, kocAbi) : undefined;
}

const getGasLimit = (gasEstimate): BigNumber => {
    return gasEstimate.mul(BigNumber.from(14)).div(BigNumber.from(10));
}

const getGasPrice = async (): Promise<number> => {
    const provider = _getProvider();
    if (!provider) throw new Error("Unable to connect to wallet");
    return Math.round((await provider.getGasPrice()).toNumber() * 1.3);
}

export const getWinner = async (symbol: Symbol): Promise<string> => {
    const contract = contracts[symbol];
    return await contract.winner();
};

export const getClaimed = async (symbol: Symbol): Promise<boolean> => {
    const contract = contracts[symbol];
    return await contract.claimed();
};

export const getPGClaimed = async (symbol: Symbol, wallet: string): Promise<boolean> => {
    const contract = contracts[symbol];
    return await contract.pgClaimed(wallet);
};

export const getLastTs = async (symbol: Symbol): Promise<BigNumber> => {
    const contract = contracts[symbol];
    return await contract.lastTs();
};

export const getClaimPeriod = async (symbol: Symbol): Promise<BigNumber> => {
    const contract = contracts[symbol];
    return await contract.CLAIM_PERIOD();
};

export const getPeriod = async (symbol: Symbol): Promise<BigNumber> => {
    const contract = contracts[symbol];
    return await contract.PERIOD();
};

export const getRound = async (symbol: Symbol): Promise<BigNumber> => {
    const contract = contracts[symbol];
    return await contract.ROUND();
};

export const getTicketSize = async (symbol: Symbol): Promise<BigNumber> => {
    const contract = contracts[symbol];
    return await contract.getTicketPrice();
};

export const getPotSize = async (symbol: Symbol, decimals: number = 18): Promise<number> => {
    const contract = contracts[symbol];
    return parseBigNumber(await contract.getPotSize(), decimals);
};

export const getGladPotSize = async (symbol: Symbol, decimals: number = 18): Promise<number> => {
    const contract = contracts[symbol];
    return parseBigNumber(await contract.getGladPotSize(), decimals);
};

export const buy = async (symbol: Symbol, price: BigNumber) => {
    const contract = contracts[symbol];
    var gasEstimate;
    var estimateError;
    await contract.estimateGas
        .buy({ value: price })
        .then(result => gasEstimate = result, error => estimateError = error);
    if (estimateError) return estimateError;

    return await contract.buy({
        gasLimit: getGasLimit(gasEstimate),
        gasPrice: await getGasPrice(),
        value: price
    });
};

export const claim = async (symbol: Symbol) => {
    const contract = contracts[symbol];
    var gasEstimate;
    var estimateError;
    await contract.estimateGas.claimWinner().then(result => gasEstimate = result, error => estimateError = error);
    if (estimateError) return estimateError;

    return await contract.claimWinner({
        gasLimit: getGasLimit(gasEstimate),
        gasPrice: await getGasPrice(),
    });
};

export const claimPglad = async (symbol: Symbol) => {
    const contract = contracts[symbol];
    var gasEstimate;
    var estimateError;
    await contract.estimateGas.claimPglad().then(result => gasEstimate = result, error => estimateError = error);
    if (estimateError) return estimateError;

    return await contract.claimPglad({
        gasLimit: getGasLimit(gasEstimate),
        gasPrice: await getGasPrice(),
    });
};
