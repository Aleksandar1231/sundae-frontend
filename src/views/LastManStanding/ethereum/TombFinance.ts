import { BigNumber } from "ethers";
import config from "../config";
import { Symbol } from "../types";
import ERC20 from "./ERC20/ERC20";
import { parseBigNumber, _getProvider } from "./ethereum";

export default class TombFinance {
    static tokens: { [name: string]: ERC20 } = {};

    constructor() {
        for (const [symbol, token] of Object.entries(config.tokens)) {
            TombFinance.tokens[symbol] = new ERC20(token.address, symbol, token.decimals);
        }
    }

    static async getTotalSupply(symbol: string): Promise<BigNumber> {
        return await TombFinance.tokens[symbol]?.totalSupply();
    }

    static async getBalanceOf(symbol: string, account: string): Promise<BigNumber> {
        return await TombFinance.tokens[symbol]?.balanceOf(account);
    }

    static async getTokenPriceInDollarsFromCoinGecko(symbol: Symbol): Promise<number> {
        const ids = {
            WAVAX: "avalanche-2",
            AVAX: "avalanche-2",
            SIFU: "sifu-vision",
        }

        return await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids[symbol]}&vs_currencies=usd`)
            .then((response) => response.json())
            .then((responseJson) => parseFloat(responseJson[ids[symbol]]?.usd))
            .catch(() => 0);
    }

    static async getTokenPriceInDollarsFromTraderJoe(symbol: Symbol): Promise<number> {
        return await fetch(`https://api.traderjoexyz.com/priceusd/${config.tokens[symbol].address}`)
            .then((response) => response.json())
            .then((responseJson) => parseBigNumber(responseJson, config.tokens[symbol].decimals))
            .catch(() => 0);
    }

    static async getTokenPriceInDollarsFromDexScreener(symbol: Symbol, network: string = "avalanche"): Promise<number> {
        const pairIds = {
            SIFU: "0x783c0eff1112f3c4139dcb661c3fc57ca9ba6f3b",
        }

        return await fetch(`https://api.dexscreener.com/latest/dex/pairs/${network}/${pairIds[symbol]}`)
            .then((response) => response.json())
            .then((responseJson) => parseFloat(responseJson?.pairs?.priceUsd))
            .catch(() => 0);
    }

    /**
       * Calculates the price of an LP token
       * Reference https://github.com/DefiDebauchery/discordpricebot/blob/4da3cdb57016df108ad2d0bb0c91cd8dd5f9d834/pricebot/pricebot.py#L150
       */
    static getLPTokenPrice(supply: number, amount: number, priceInDollars: number): number {
        return amount / supply * priceInDollars * 2; //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
    }


    /**
    * Method to calculate the tokenPrice of the deposited asset in a pool/bank
    * If the deposited token is an LP it will find the price of its pieces
    * @param depositTokenName
    * @param oneOfTheLpTokens
    * @param tokenPrice
    * @returns
    */
    static async getDepositTokenPriceInDollars(depositTokenName: Symbol, oneOfTheLpTokens: Symbol, tokenPrice: number): Promise<number> {
        if (depositTokenName === Symbol.USDC) return 1;
        else if (depositTokenName.includes(" LP")) {
            /*  if (!oneOfTheLpTokens) return 0;
             const amount = (await TombFinance.getBalanceOf(oneOfTheLpTokens, config.tokens[depositTokenName].address))?.toNumber();
             const totalSupply = (await TombFinance.getTotalSupply(depositTokenName))?.toNumber();
             if (amount === 0 || totalSupply === 0) return 0;
             return this.getLPTokenPrice(totalSupply, amount, tokenPrice); */
            const price = await TombFinance.getTokenPriceInDollarsFromDexScreener(depositTokenName);
            if (price) return price;
            else {
                switch (depositTokenName) {
                }
            }
        }
        else return await TombFinance.getTokenPriceInDollarsFromCoinGecko(depositTokenName) || 50;
    }
}

new TombFinance();