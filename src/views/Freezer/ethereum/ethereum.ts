import { BigNumber, Contract, providers, utils } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import config from "../config";

declare const window: any;

export const _isMetaMaskInstalled = () => {
    if (typeof window === "undefined") return;
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
};

export const _getProvider = () => {
    if (!_isMetaMaskInstalled()) return null;
    return new providers.Web3Provider(window.ethereum, 'any');
};

export const getBalance = async (address: string, decimals: number = 18): Promise<number> => {
    const provider = _getProvider();
    if (!provider) return 0;
    return parseBigNumber(await provider.getBalance(address), decimals);
}

export const _getChain = async (): Promise<number> => {
    const provider = _getProvider();
    if (!provider) return -1;
    return (await provider.getNetwork())?.chainId;
};

const _onAccountsChanged = (callback: Function) => {
    if (!_isMetaMaskInstalled()) return;
    window.ethereum.on("accountsChanged", callback);
};

const _onChainChanged = (callback: Function) => {
    if (!_isMetaMaskInstalled()) return;
    window.ethereum.on("chainChanged", callback);
};

export const _getAddress = async (): Promise<string> => {
    const provider = _getProvider();
    if (!provider) return "";
    try {
        const accounts = await provider.listAccounts();
        return accounts.length > 0 ? accounts[0] : "";
    } catch (e) {
        return "";
    }
};

// Fixes Error: "unchecked runtime.lasterror: could not establish connection. receiving end does not exist."
// that occurs on the initial page load when Metamask is installed
const maybeFixMetamaskConnection = async () => {
    // Reloads the page after n seconds if Metamask is installed but not initialized
    const waitSeconds = 10;
    const { ethereum } = window;
    if (typeof ethereum !== 'undefined' && !ethereum._state.initialized) {
        while (!ethereum._state.initialized) {
            await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
            window.location.reload();
        }
    }
}

export const useWallet = () => {
    const [wallet, setWallet] = useState<string | null>(null);
    const [chain, setChain] = useState<number>(-1);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        const load = async () => {
            try {
                /* await maybeFixMetamaskConnection(); */

                setWallet((await _getAddress())?.toLowerCase());
                setChain(await _getChain());
                setLoaded(true);
            } catch (error) {
                setLoaded(true);
                return error;
            }
        };

        _onAccountsChanged((_address: string) => {
            if (!_address[0]) return;
            setWallet(_address[0].toLowerCase());
        });
        _onChainChanged((_chain: any) => {
            if (!_chain) return;
            setChain(parseInt(_chain));
        });
        load();
    }, []);

    return {
        wallet,
        chain,
        loaded,
    };
};

export const connectMetamask = async () => {
    if (!_isMetaMaskInstalled()) return false;
    try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        return true;
    } catch (e) {
        return false;
    }
};

export const switchToNetwork = async (chainId: number = config.chainId) => {
    if (!_isMetaMaskInstalled()) return false;
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${parseInt(chainId.toString() || "").toString(16)}` }],
        });
        return true;
    } catch (e) {
        return false;
    }
};

export const watchTransaction = (txHash: string, callback: Function) => {
    const provider = _getProvider();
    if (!provider) return;
    provider.once(txHash, (transaction) => {
        callback(transaction, transaction.status === 1);
    });
};

export const parseBigNumber = (bn: BigNumber, decimalsOrUnitName: string | number = "ether"): number => {
    if (!bn) return 0;
    try {
        return parseFloat(utils.formatUnits(bn, decimalsOrUnitName));
    } catch (e) {
        return 0;
    }
};

export function getContract(address: string, abi) {
    const provider = _getProvider();
    if (provider) {
        const signer = provider.getSigner();
        return new Contract(address, abi, signer);
    }
}

export const getGasLimit = (gasEstimate, multiplier = 14) => {
    return gasEstimate.mul(BigNumber.from(multiplier)).div(BigNumber.from(10));
}

export const getGasPrice = async (multiplier = 1.3) => {
    const provider = _getProvider();
    if (provider) {
        const gasPrice: any = await provider.getGasPrice();
        return Math.round(gasPrice * multiplier);
    }
}

export const addTokenToProvider = async (
    address: string,
    symbol: string,
    decimals: number,
    image: string
) => {
    try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        return await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: address, // The address that the token is at.
                    symbol: symbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: decimals, // The number of decimals in the token
                    image: image, // A string url of the token logo
                },
            },
        });
    } catch (error) {
        return false;
    }
}