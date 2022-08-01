import { BigNumber, Contract } from 'ethers';
import { Signer } from '@ethersproject/abstract-signer';
import { Provider } from '@ethersproject/abstract-provider';
import { TransactionResponse } from '@ethersproject/providers';
import { formatUnits } from 'ethers/lib/utils';
import ABI from './ERC20Abi';
import { getContract, parseBigNumber } from '../ethereum';

export default class ERC20 {
    private contract: Contract;
    private MAX_APPROVE = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

    address: string;
    symbol: string;
    decimals: number;

    constructor(address: string, symbol: string, decimals = 18) {
        this.contract = getContract(address, ABI);
        this.address = address;
        this.symbol = symbol;
        this.decimals = decimals;
    }

    connect(signerOrProvider: Signer | Provider) {
        this.contract = new Contract(this.address, ABI, signerOrProvider);
    }

    get estimateGas() {
        return this.contract.estimateGas;
    }

    async totalSupply(): Promise<BigNumber> {
        return await this.contract.totalSupply();
    }

    async balanceOf(account: string): Promise<BigNumber> {
        return await this.contract.balanceOf(account);
    }

    async transfer(recipient: string, amount: BigNumber): Promise<TransactionResponse> {
        return await this.contract.transfer(recipient, amount);
    }

    async getAllowance(owner: string, spender: string): Promise<BigNumber> {
        return await this.contract.allowance(owner, spender);
    }

    async approve(spender: string): Promise<TransactionResponse> {
        return await this.contract.approve(spender, BigNumber.from(this.MAX_APPROVE));
    }

    async transferFrom(sender: string, recipient: string, amount: BigNumber): Promise<TransactionResponse> {
        return await this.contract.transferFrom(sender, recipient, amount);
    }

    async displayedBalanceOf(account: string): Promise<string> {
        const balance = await this.balanceOf(account);
        return formatUnits(balance, this.decimals);
    }

    async displayedTotalSupply(): Promise<string> {
        const supply = await this.totalSupply();
        return Number(formatUnits(supply, this.decimals)).toFixed(0);
    }
}