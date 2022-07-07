import { BigNumber } from "ethers";
import { useEffect, useRef, useState } from "react";
import ContainerWithBgImage from "./components/ContainerWithBgImage/ContainerWithBgImage";
import config from "../LastManStanding/config";
import { parseBigNumber, useWallet, watchTransaction } from "./ethereum/ethereum";
import handleResult from "./ethereum/handleresult";
import Countdown from "./Countdown";
import usdc from "../../assets/img/lms/usdc.svg";
import usdc_sm from "../../assets/img/lms/usdc_sm.svg";
import avax from "../../assets/img/lms/avax.svg";
import avax_sm from "../../assets/img/lms/avax_sm.svg";
import grape from "../../assets/img/lms/grape.svg";
import grape_sm from "../../assets/img/lms/grape_sm.svg";

import CustomBtn from "./components/CustomBtn/CustomBtn";
import EthereumInteraction from "./ethereum/EthereumInteraction";
import { buy, claim, getClaimed, getClaimPeriod, getLastTs, getPeriod, getPotSize, getTicketSize, getWinner } from "./ethereum/lms/lms";
import separateNumberWithCommas from "../../utils/separateNumberWithCommas";
import Loading from "./components/Loading/Loading";
import { BtnType, DynamicObject, Size, Symbol } from "./types";
import Svg from "./components/Svg";
import TombFinance from "./ethereum/TombFinance";
import useMediaQuery from "../../hooks/useMediaQuery";
import { ChainId } from "@traderjoe-xyz/sdk";
import React from "react";

import Page from '../../components/Page';
import { Button, CardContent, Grid, Typography, Container } from '@material-ui/core';



interface IKoCPage {
    refHeader: any;
}

interface Pot {
    inactive?: boolean;
    earning?: boolean;
    symbol: Symbol;
    icon: string;
    iconWidth: number | string;
    iconHeight: number | string;
    iconClassName?: string;
    iconClassNameCollapsed?: string;
    iconSm: string;
    iconSmWidth: number | string;
    iconSmHeight: number | string;
    border: string;
    shadow: string;
    text: string;
    fill: string;
    bg: string;
    bgLight: string;
    color: string;
}

export default function KocPage({ refHeader }: IKoCPage): JSX.Element {
    const { wallet, chain, loaded } = useWallet();

    const bp1280px = useMediaQuery(1280);

    const tokensUnfiltered = {
        AVAX: null,
        USDC: TombFinance.tokens[`koc${Symbol.USDC}`],
        GRAPE: TombFinance.tokens[Symbol.GRAPE],

    }
    const tokens = {};
    for (const [key, value] of Object.entries(tokensUnfiltered)) {
        if (value !== undefined) tokens[key] = value;
    }

    const pots: Pot[] = [
        {
            symbol: Symbol.USDC,
            earning: true,
            icon: usdc,
            iconWidth: 72,
            iconHeight: 72,
            iconSm: usdc_sm,
            iconSmWidth: 35,
            iconSmHeight: 35,
            border: "border-usdc",
            shadow: "shadow-[0_8px_14px_rgba(42,120,205,0.04)] hover:shadow-[0_10px_25px_rgba(42,120,205,0.2)]",
            text: "text-usdc",
            fill: "fill-usdc",
            bg: "#6ca4dc",
            bgLight: "bg-[#f0f5fb]",
            color: "usdc",
        },
        {
            symbol: Symbol.AVAX,
            icon: avax,
            iconWidth: 72,
            iconHeight: 72,
            iconSm: avax_sm,
            iconSmWidth: 35,
            iconSmHeight: 35,
            border: "border-avax",
            shadow: "shadow-[0_8px_14px_rgba(236,69,69,0.04)] hover:shadow-[0_10px_25px_rgba(236,69,69,0.2)]",
            text: "text-avax",
            fill: "fill-avax",
            bg: "#ee868c",
            bgLight: "bg-[#fbe6e8]",
            color: "avax",
        },
        {
            symbol: Symbol.GRAPE,
            icon: grape,
            iconWidth: 71,
            iconHeight: 72,
            iconSm: grape_sm,
            iconSmWidth: 35,
            iconSmHeight: 35,
            border: "border-grape",
            shadow: "shadow-[0_8px_14px_rgba(130,9,108,0.04)] hover:shadow-[0_10px_25px_rgba(130,9,108,0.2)]",
            text: "text-grape",
            fill: "fill-grape",
            bg: "#82096c",
            bgLight: "bg-[#e6cde1]",
            color: "grape",
        }
    ]

    const refsBigBoxes = useRef({});

    const [prevWallet, setPrevWallet] = useState<string>();
    const [approved, setApproved] = useState<DynamicObject<boolean>>(() => {
        const approved = {};
        Object.keys(tokens).filter(key => key !== Symbol.AVAX).forEach(key => {
            approved[key] = undefined;
        });
        return approved;
    });
    const [loading, setLoading] = useState<DynamicObject<boolean>>(() => {
        const loading = {};
        Object.keys(tokens).forEach(key => {
            loading[key] = false;
        });
        return loading;
    });
    const [response, setResponse] = useState<DynamicObject<string>>(() => {
        const loading = {};
        Object.keys(tokens).forEach(key => {
            loading[key] = "";
        });
        return loading;
    });
    const [avaxPriceInDollars, setAvaxPriceInDollars] = useState<number>(0)
    const [avaxPriceInDollarsPoll, setAvaxPriceInDollarsPoll] = useState();
    const [timePoll, setTimePoll] = useState();
    const [hoveredSmallBox, setHoveredSmallBox] = useState<Symbol>();
    const [hoveredBigBox, setHoveredbigBox] = useState<Symbol>();
    const [openedPots, setOpenedPots] = useState<Symbol[]>([]);
    const [sortedPots, setSortedPots] = useState<Pot[]>(pots);

    const [winner, setWinner] = useState<DynamicObject<string>>();
    const [isClaimed, setIsClaimed] = useState<DynamicObject<boolean>>();
    const [lastTs, setLastTs] = useState<DynamicObject<BigNumber>>();
    const [lastTsCandidate, setLastTsCandidate] = useState<DynamicObject<BigNumber>>();
    const [claimPeriod, setClaimPeriod] = useState<DynamicObject<BigNumber>>();
    const [period, setPeriod] = useState<DynamicObject<BigNumber>>();
    const [ticketSize, setTicketSize] = useState<DynamicObject<BigNumber>>();
    const [potSize, setPotSize] = useState<DynamicObject<number>>();

    useEffect(() => {
        if (prevWallet && wallet) {
            Object.keys(tokens).filter((key: string) => key !== Symbol.AVAX).forEach((key: string) => {
                if (localStorage.getItem(`isApprovedKoc${key}`) === "true") localStorage.removeItem(`isApprovedKoc${key}`);
            });
        }
        setPrevWallet(wallet);

        const getAllowance = async (symbol: Symbol, newApproved) => {
            const allowance = await tokens[symbol].getAllowance(wallet, config.koc[symbol]) || BigNumber.from(0);
            if (allowance && allowance.gt(0)) newApproved[symbol] = true;
            else newApproved[symbol] = false;
        }

        const initApproved = async () => {
            const newApproved = { ...approved };
            const keys = Object.keys(tokens).filter(key => key !== Symbol.AVAX);
            for (let i = 0; i < keys.length; i++) {
                const key: any = keys[i];
                if (localStorage.getItem(`isApprovedKoc${key}`) === "true") newApproved[key] = true;
                else if (wallet && chain === config.chainId) await getAllowance(key, newApproved);
                else newApproved[key] = false;
            }
            setApproved(newApproved);
        }
        initApproved();

    }, [wallet, chain]);

    useEffect(() => {
        const initAvaxPriceInDollars = async () => setAvaxPriceInDollars(await TombFinance.getTokenPriceInDollarsFromCoinGecko(Symbol.AVAX));

        const correctChain = chain === config.chainId;
        if (wallet && correctChain) {
            initAvaxPriceInDollars();
        }

        if (avaxPriceInDollarsPoll !== undefined) clearInterval(avaxPriceInDollarsPoll);

        const avaxPriceInDollarsInterval: any = setInterval(async () => {
            if (wallet && correctChain) await initAvaxPriceInDollars();
        }, 60000);
        setAvaxPriceInDollarsPoll(avaxPriceInDollarsInterval);

        return () => clearInterval(avaxPriceInDollarsInterval);
    }, [wallet, chain]);

    useEffect(() => {
        const initPeriod = async () => {
            const period = {};
            const keys = Object.keys(tokens);
            for (let i = 0; i < keys.length; i++) {
                const key: any = keys[i];
                period[key] = await getPeriod(key);
            }
            setPeriod(period);
        }

        const initLastTsCandidate = async () => {
            const lastTs = {};
            const keys = Object.keys(tokens);
            for (let i = 0; i < keys.length; i++) {
                const key: any = keys[i];
                lastTs[key] = await getLastTs(key);
            }
            setLastTsCandidate(lastTs);
        }

        const correctChain = chain === config.chainId;
        if (wallet && correctChain) {
            initPeriod();
            initLastTsCandidate();
        }

        if (timePoll !== undefined) clearInterval(timePoll);

        const timeInterval: any = setInterval(async () => {
            if (wallet && correctChain) await initLastTsCandidate();
        }, 60000);
        setTimePoll(timeInterval);

        return () => clearInterval(timeInterval);
    }, [wallet, chain]);

    useEffect(() => {
        const initData = async () => {
            const winner = {};
            const isClaimed = {};
            const claimPeriod = {};
            const ticketSize = {};
            const potSize = {};
            const keys = [Symbol.USDC, Symbol.AVAX].concat(openedPots);
            for (let i = 0; i < keys.length; i++) {
                const key: any = keys[i];
                winner[key] = await getWinner(key) || "0x00";
                isClaimed[key] = await getClaimed(key);
                claimPeriod[key] = await getClaimPeriod(key);
                ticketSize[key] = await getTicketSize(key);
                potSize[key] = await getPotSize(key, config.tokens[key].decimals);
            }
            setWinner(winner);
            setIsClaimed(isClaimed);
            setClaimPeriod(claimPeriod);
            setTicketSize(ticketSize);
            setPotSize(potSize);
        }

        const correctChain = chain === config.chainId;
        if (wallet && correctChain) {
            initData();
        }
    }, [wallet, chain, openedPots]);

    useEffect(() => {
        const newState = { ...lastTs };
        var needsUpdate = false;
        pots.filter(pot => !pot.inactive).forEach(pot => {
            const symbol = pot.symbol;
            if (lastTs?.[symbol] === undefined || !lastTsCandidate?.[symbol]?.eq(lastTs?.[symbol])) {
                newState[symbol] = lastTsCandidate?.[symbol];
                needsUpdate = true;
            }
        });
        if (needsUpdate) {
            setLastTs(newState);

            const updateData = async () => {
                const winner = {};
                const isClaimed = {};
                const ticketSize = {};
                const potSize = {};
                const keys = [Symbol.USDC, Symbol.AVAX].concat(openedPots);
                for (let i = 0; i < keys.length; i++) {
                    const key: any = keys[i];
                    winner[key] = await getWinner(key) || "0x00";
                    isClaimed[key] = await getClaimed(key);
                    ticketSize[key] = await getTicketSize(key);
                    potSize[key] = await getPotSize(key, config.tokens[key].decimals);
                }
                setWinner(winner);
                setIsClaimed(isClaimed);
                setTicketSize(ticketSize);
                setPotSize(potSize);
            }

            if (wallet && chain === config.chainId) {
                updateData();
            }
        }
    }, [lastTsCandidate]);


    const handleSetLoading = (value: boolean, symbol: Symbol) => {
        const newLoading = { ...loading };
        newLoading[symbol] = value;
        setLoading(newLoading);
    }
    const handleSetResponse = (value: string, symbol: Symbol) => {
        const newState = { ...response };
        newState[symbol] = value;
        setResponse(newState);
    }

    const handleSetApproved = (value: boolean, symbol: Symbol) => {
        const newApproved = { ...approved };
        newApproved[symbol] = value;
        setApproved(newApproved);
    }

    const onApprove = async (symbol: Symbol) => {
        handleSetLoading(true, symbol);
        handleSetResponse("", symbol);

        try {
            const result = await tokens[symbol].approve(config.koc[symbol]);
            const operation = "Approve";
            handleSetResponse(handleResult(result, operation), symbol);
            if (!("hash" in result)) {
                handleSetLoading(false, symbol)
                return;
            }

            watchTransaction(result.hash, (receipt, success) => {
                handleSetLoading(false, symbol);
                if (!success) {
                    return handleSetResponse(`${operation} failed. Check transaction.`, symbol);
                }
                localStorage.setItem(`isApprovedKoc${symbol}`, 'true');
                handleSetApproved(true, symbol);
                handleSetResponse(`${operation} has succeeded!`, symbol);
            });
        } catch (e) {
            handleSetLoading(false, symbol);
        }
    }

    const onBuy = async (symbol: Symbol) => {
        handleSetLoading(true, symbol);
        handleSetResponse("", symbol);

        try {
            const result = await buy(symbol, symbol === Symbol.AVAX ? ticketSize[Symbol.AVAX] : BigNumber.from(0));
            const operation = "Joining the tournament";
            handleSetResponse(handleResult(result, operation), symbol);
            if (!("hash" in result)) {
                handleSetLoading(false, symbol);
                return;
            }

            watchTransaction(result.hash, (receipt, success) => {
                handleSetLoading(false, symbol);
                if (!success) {
                    return handleSetResponse(`${operation} failed. Check transaction.`, symbol);
                }
                handleSetResponse(`${operation} has succeeded!`, symbol);
            });
        } catch (e) {
            handleSetLoading(false, symbol);
        }
    }

    const onClaim = async (symbol: Symbol) => {
        handleSetLoading(true, symbol);
        handleSetResponse("", symbol);

        try {
            const result = await claim(symbol);
            const operation = "Claiming";
            handleSetResponse(handleResult(result, operation), symbol);
            if (!("hash" in result)) {
                handleSetLoading(false, symbol);
                return;
            }

            watchTransaction(result.hash, (receipt, success) => {
                handleSetLoading(false, symbol);
                if (!success) {
                    return handleSetResponse(`${operation} failed. Check transaction.`, symbol);
                }

                handleSetResponse(``, symbol);

                const newState = { ...isClaimed };
                newState[symbol] = true;
                setIsClaimed(newState);
            });
        } catch (e) {
            handleSetLoading(false, symbol);
        }
    }

    const getBoobyPrice = (symbol: Symbol): number => {
        const lastTsNumber = lastTs?.[symbol]?.toNumber();
        if (lastTsNumber) {
            const hourInSecs = 3600;
            const halfAnHourInSecs = hourInSecs * 0.5;
            const secondsSinceLastTs = Math.floor(Date.now() / 1000 - lastTsNumber);
            if (secondsSinceLastTs >= halfAnHourInSecs) {
                const ticketSizeParsed = parseBigNumber(ticketSize?.[symbol], config.tokens[symbol].decimals);
                return ticketSizeParsed / hourInSecs / 3 * (secondsSinceLastTs - halfAnHourInSecs);
            }
            else return 0;
        }
        else return 0;
    }

    const getRemainingSeconds = (symbol: string): number => lastTs?.[symbol]?.add(period?.[symbol] || 0)?.toNumber() - Math.round(Date.now() / 1000);

    useEffect(() => {
        const usdcAvax = pots.slice(0, 2);
        const rest = pots.slice(2);
        const isNotTicking = (pot) => !lastTs?.[pot.symbol] || lastTs?.[pot.symbol]?.eq(0)
            || (Date.now() / 1000 > lastTs?.[pot.symbol]?.toNumber() + period?.[pot.symbol]?.toNumber());
        const sortByLastTs = (a, b) => {
            const aNotTicking = isNotTicking(a);
            const bNotTicking = isNotTicking(b);
            if (aNotTicking && bNotTicking) return 0;
            else if (aNotTicking) return 1;
            else if (bNotTicking) return -1;
            else return getRemainingSeconds(a.symbol) - getRemainingSeconds(b.symbol);
        }
        const newSortedPots = usdcAvax.sort(sortByLastTs).concat(rest.sort(sortByLastTs));
        var diff = false;
        for (var i = 0; i < newSortedPots.length; i++) {
            if (newSortedPots[i].symbol !== sortedPots[i].symbol) diff = true;
        }
        if (diff) setSortedPots(newSortedPots);
    }, [lastTs, period, sortedPots]);

    return (

        <Page>
            <ContainerWithBgImage bgImg="hero" lazyLoadNotNeeded subContainerNotNeeded className="min-h-[100vh]" bgClassName="blur-[6px]">
                <div className="bg-lightblue bg-opacity-70 w-full h-full min-h-[100vh]">
                    <div className="container mx-auto px-2 sm:px-5 py-[130px] flex justify-center">
                        <div className="text-black text-center w-full">
                        <Typography color="textPrimary" align="center" variant="h3" gutterBottom style={{marginTop:'50px'}}>
                            Last Man Standing
                         </Typography>

                        <Typography color="textPrimary" align="center" variant="h5" gutterBottom style={{marginTop:'25px'}}>
                            Fight and win to become the champion
                        </Typography>
                            {/* <div className="flex flex-wrap justify-center items-center mt-10 mb-24">
                                {sortedPots.map((pot, i: number) => {
                                    const symbol: Symbol = pot.symbol;
                                    return (
                                        <div
                                            key={i.toString()}
                                            className={`flex space-x-3 px-2 py-3 my-1.5 sm:m-1.5 w-[290px]
                                            bg-[#ffffffb3] transition duration-500
                                            border border-solid ${pot.border} rounded-[10px]
                                            ${pot.shadow}
                                            cursor-pointer`}
                                            onMouseEnter={() => setHoveredSmallBox(symbol)}
                                            onMouseLeave={() => setHoveredSmallBox(undefined)}
                                            onClick={() => {
                                                const yOffset = -refHeader?.current?.offsetHeight - 0;
                                                const y = refsBigBoxes?.current?.[i]?.getBoundingClientRect().top
                                                    + window.pageYOffset + yOffset;
                                                window.scrollTo({ top: y, behavior: "smooth" });
                                            }}
                                        >
                                            <div className="w-[71.75px]">
                                                <div className="flex justify-center">
                                                    <img
                                                        src={pot.iconSm}
                                                        alt=""
                                                        width={pot.iconSmWidth}
                                                        height={pot.iconSmHeight}
                                                        className={`${pot.iconClassName || ""} mb-1`}
                                                    />
                                                </div>
                                                <p className="text-12 font-bold mb-1">{symbol}</p>
                                                <div
                                                    className={`text-18 ${pot.text} ${pot.fill} transition duration-300
                                                flex items-center justify-center`}
                                                    style={{
                                                        filter: hoveredSmallBox === symbol && "brightness(.75)",
                                                    }}
                                                >
                                                    <span className="text-12 mr-1 font-medium">Go to</span>
                                                    <Svg name="triangle" width={14} height={13} />
                                                </div>
                                            </div>
                                            <Countdown
                                                period={period?.[symbol]}
                                                start={lastTs?.[symbol]}
                                                size={Size.sm}
                                                text={pot.text}
                                                bg={pot.bg}
                                                bgLight={pot.bgLight}
                                            />
                                        </div>
                                    )
                                })
                                }
                            </div > */}
                            <div className="flex flex-wrap justify-center">
                                {sortedPots.map((pot, i: number) => {
                                    const symbol: Symbol = pot.symbol;
                                    const isOpen: boolean = openedPots.includes(symbol);
                                    const avaxOrUsdc: boolean = symbol === Symbol.AVAX || symbol === Symbol.USDC;
                                    const notAvaxAndNotUsdc: boolean = symbol !== Symbol.AVAX && symbol !== Symbol.USDC;

                                    return (
                                        <div
                                            key={i.toString()}
                                            ref={element => (refsBigBoxes.current[i] = element)}
                                            className={`m-2 sm:m-6 ${(isOpen || avaxOrUsdc) ? "px-5 py-12 sm:px-[48px] sm:pt-[52px] sm:pb-[26px]" : "p-2"}
                                            w-full md:w-[690px] ${(avaxOrUsdc) ? "xl:min-h-[859px]" : ""}                        
                                            bg-[#ffffffb3] transition duration-500
                                            border border-solid ${!pot.inactive ? pot.border : "border-gray"} rounded-[10px]
                                            ${!pot.inactive ? pot.shadow : ""}
                                            transition-all duration-300 overflow-hidden relative
                                            ${!isOpen && notAvaxAndNotUsdc ? pot.inactive ? "cursor-not-allowed" : "cursor-pointer" : ""}`}
                                            style={{
                                                height: notAvaxAndNotUsdc && bp1280px ? (isOpen ? 859 : 90) : undefined,
                                                maxHeight: notAvaxAndNotUsdc && !bp1280px ? (isOpen ? refsBigBoxes?.current[i]?.scrollHeight * 1.5 : 90) : undefined,
                                            }}
                                            onMouseEnter={() => setHoveredbigBox(symbol)}
                                            onMouseLeave={() => setHoveredbigBox(undefined)}
                                            onClick={
                                                !isOpen && !pot.inactive
                                                    ? () => setOpenedPots(
                                                        isOpen
                                                            ? openedPots.filter(pot => pot !== symbol)
                                                            : openedPots.concat(symbol)
                                                    )
                                                    : undefined}
                                        >
                                            {notAvaxAndNotUsdc &&
                                                <span
                                                    className={`text-30 font-medium absolute top-5 right-5 
                                                ${!pot.inactive ? pot.text : ""} transition duration-300
                                                opacity-75 ${!pot.inactive ? "hover:opacity-100 cursor-pointer " : ""}
                                                ${hoveredBigBox === symbol && !pot.inactive ? "opacity-100" : "opacity-75"}`}
                                                    onClick={
                                                        isOpen && !pot.inactive
                                                            ? () => setOpenedPots(
                                                                isOpen
                                                                    ? openedPots.filter(pot => pot !== symbol)
                                                                    : openedPots.concat(symbol)
                                                            )
                                                            : undefined}
                                                >
                                                    {isOpen ? "-" : "+"}
                                                </span>
                                            }
                                            <div className={!isOpen && notAvaxAndNotUsdc ? "grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-2 gap-3 items-center mb-5" : ""}>
                                                <div className={`flex ${!isOpen && notAvaxAndNotUsdc
                                                    ? `col-span-1 justify-center sm:justify-end ${pot.iconClassNameCollapsed || ""}`
                                                    : "justify-center mb-5"}`}>
                                                    <img src={pot.icon} alt="" width={pot.iconWidth} height={pot.iconHeight} className={pot.iconClassName || ""} />
                                                </div>
                                                <p className={`text-18 sm:text-20 font-bold ${(isOpen || avaxOrUsdc) ? "mb-3" : "col-span-2 xs:col-span-3 sm:col-span-1 text-left"}`}>
                                                    {symbol}
                                                </p>
                                            </div>
                                            <p className={`text-gray text-16 sm:text-18 mb-8`}>
                                                If you survive for {period?.[symbol]?.toNumber() / 3600 || 0} hours in the Tournament,
                                                <br />
                                                <span className="font-bold">
                                                    you get the whole pot:
                                                    {" "}
                                                    {separateNumberWithCommas(parseFloat(potSize?.[symbol]?.toFixed(2) || "0"))} {symbol}
                                                    {pot.symbol === Symbol.AVAX &&
                                                        <>
                                                            {" "}
                                                            (${separateNumberWithCommas(parseFloat((potSize?.[symbol] * avaxPriceInDollars)?.toFixed(2)) || "0")})
                                                        </>
                                                    }
                                                    .
                                                </span>
                                                <br />
                                                {pot.earning &&
                                                    <>
                                                        It only takes 30 minutes of ruling the Colosseum to begin earning!
                                                        <br />
                                                    </>}
                                                <span className="font-bold">Only the most recent</span> Gladiator can win the pot.
                                                Another Gladiator can come by and dominate the Colosseum themselves;
                                                if another Gladiator joins the tournament, they will knock you off and dominate the tournament.
                                                {pot.symbol === Symbol.AVAX && <><br /></>}
                                                <br /> <br />
                                                {winner?.[symbol] !== undefined
                                                    && !BigNumber.from(winner?.[symbol]).eq(0)
                                                    && lastTs?.[symbol] !== undefined
                                                    && period?.[symbol] !== undefined
                                                    && potSize?.[symbol] !== undefined
                                                    && (winner?.[symbol]
                                                        && wallet
                                                        && winner?.[symbol]?.toLowerCase() === wallet
                                                        ? Date.now() / 1000 < lastTs?.[symbol]?.toNumber() + period?.[symbol]?.toNumber()
                                                            ? <>
                                                                The Colosseum is roaring! <span className='font-bold'>You are dominating</span> the Tournament!
                                                                <br />
                                                                If you survive until the timer runs out,
                                                                <br />
                                                                <span className='font-bold'>
                                                                    you will receive
                                                                    {" "}
                                                                    {separateNumberWithCommas(parseFloat(potSize?.[symbol]?.toFixed(2) || "0"))} {symbol}
                                                                    {pot.symbol === Symbol.AVAX &&
                                                                        <>
                                                                            {" "}
                                                                            (${separateNumberWithCommas(parseFloat((potSize?.[symbol] * avaxPriceInDollars)?.toFixed(2)) || "0")})
                                                                        </>
                                                                    }
                                                                    .
                                                                </span>
                                                                {pot.earning &&
                                                                    <>
                                                                        <br /> <br />
                                                                        If you were kicked out of the Colosseum right now,
                                                                        <br />
                                                                        you'd earn
                                                                        {" "}
                                                                        <span className='font-bold'>{separateNumberWithCommas(parseFloat(getBoobyPrice(symbol)?.toFixed(2)) || "0")} {symbol}
                                                                            {pot.symbol === Symbol.AVAX &&
                                                                                <>
                                                                                    {" "}
                                                                                    (${separateNumberWithCommas(parseFloat((getBoobyPrice(symbol) * avaxPriceInDollars)?.toFixed(2)) || "0")})
                                                                                </>
                                                                            }
                                                                            .
                                                                        </span>
                                                                    </>
                                                                }
                                                            </>
                                                            :
                                                            <>
                                                                The Colosseum is roaring! You have <span className='font-bold'>won!</span>
                                                                <br />
                                                                Claim
                                                                {" "}
                                                                <span className='font-bold'>your {separateNumberWithCommas(parseFloat(potSize?.[symbol]?.toFixed(2) || "0"))} {symbol}
                                                                    {pot.symbol === Symbol.AVAX &&
                                                                        <>
                                                                            {" "}
                                                                            (${separateNumberWithCommas(parseFloat((potSize?.[symbol] * avaxPriceInDollars)?.toFixed(2)) || "0")})
                                                                        </>
                                                                    }
                                                                    !
                                                                </span>
                                                            </>
                                                        : winner?.[symbol] &&
                                                        (Date.now() / 1000 < lastTs?.[symbol]?.toNumber() + period?.[symbol]?.toNumber()
                                                            ?
                                                            <>
                                                                Currently the following address
                                                                {" "}
                                                                <span className='font-bold'>
                                                                    will win the
                                                                    {" "}
                                                                    {separateNumberWithCommas(parseFloat(potSize?.[symbol]?.toFixed(2) || "0"))} {symbol}
                                                                    {pot.symbol === Symbol.AVAX &&
                                                                        <>
                                                                            {" "}
                                                                            (${separateNumberWithCommas(parseFloat((potSize?.[symbol] * avaxPriceInDollars)?.toFixed(2)) || "0")})
                                                                        </>
                                                                    }
                                                                </span>:
                                                                <br />
                                                                <span className='break-all'>
                                                                    {winner?.[symbol]?.slice(0, 6)}...{winner?.[symbol]?.slice(-4)}
                                                                </span>.
                                                            </>
                                                            :
                                                            <>
                                                                The tournament is over.
                                                                <br />
                                                                <span className='break-all'>
                                                                    {winner?.[symbol]?.slice(0, 6)}...{winner?.[symbol]?.slice(-4)}
                                                                </span>
                                                                <br />
                                                                has
                                                                {" "}
                                                                <span className='font-bold'>
                                                                    won
                                                                    {" "}
                                                                    {separateNumberWithCommas(parseFloat(potSize?.[symbol]?.toFixed(2) || "0"))} {symbol}
                                                                    {pot.symbol === Symbol.AVAX &&
                                                                        <>
                                                                            {" "}
                                                                            (${separateNumberWithCommas(parseFloat((potSize?.[symbol] * avaxPriceInDollars)?.toFixed(2)) || "0")})
                                                                        </>
                                                                    }
                                                                    !</span>
                                                            </>))}
                                            </p>
                                            <Countdown
                                                period={period?.[symbol]}
                                                start={lastTs?.[symbol]}
                                                text={pot.text}
                                                bg={pot.bg}
                                                bgLight={pot.bgLight}
                                                className={"mb-8"}
                                            />
                                            <div className="flex justify-center mb-6">
                                                <EthereumInteraction
                                                    wallet={wallet}
                                                    chain={chain}
                                                    loaded={loaded}
                                                    loadingColor={pot.color}
                                                    connectButton={
                                                        <CustomBtn color={pot.color}>
                                                            Connect to Metamask
                                                        </CustomBtn>
                                                    }
                                                    chainSwitchButton={
                                                        <CustomBtn color={pot.color}>
                                                            Switch to Avalanche
                                                        </CustomBtn>
                                                    }
                                                >
                                                    {(symbol !== Symbol.AVAX ? approved?.[symbol] !== undefined : true)
                                                        && winner?.[symbol] !== undefined
                                                        && isClaimed?.[symbol] !== undefined
                                                        && lastTs?.[symbol] !== undefined
                                                        && period?.[symbol] !== undefined
                                                        && claimPeriod?.[symbol] !== undefined
                                                        && potSize?.[symbol] !== undefined
                                                        && ticketSize?.[symbol] !== undefined
                                                        ? (symbol !== Symbol.AVAX && !approved?.[symbol]
                                                            ?
                                                            <CustomBtn
                                                                color={pot.color}
                                                                onClick={async () => await onApprove(symbol)}
                                                                loading={loading?.[symbol]}
                                                                disabled={Object.values(loading).find(loading => loading)}
                                                                className={"min-w-[141px] min-h-[46px]"}
                                                            >
                                                                Approve
                                                            </CustomBtn>
                                                            : (!lastTs?.[symbol] || lastTs?.[symbol]?.eq(0)
                                                                || Date.now() / 1000 < lastTs?.[symbol]?.toNumber() + period?.[symbol]?.toNumber())
                                                                ?
                                                                <CustomBtn
                                                                    color={pot.color}
                                                                    loading={loading?.[symbol]}
                                                                    disabled={Object.values(loading).find(loading => loading)}
                                                                    onClick={async () => await onBuy(symbol)}
                                                                    className={`sm:min-w-[387px] min-h-[46px]`}
                                                                >
                                                                    {(!lastTs?.[symbol] || lastTs?.[symbol]?.eq(0)) ? "Be the first to join and start" : "Join"}
                                                                    {" "}
                                                                    the Tournament for
                                                                    {" "}
                                                                    {separateNumberWithCommas(parseFloat(parseBigNumber(ticketSize?.[symbol], config.tokens[symbol].decimals)?.toFixed(2)))} {symbol}
                                                                    {pot.symbol === Symbol.AVAX &&
                                                                        <>
                                                                            {" "}
                                                                            (${separateNumberWithCommas(parseFloat((parseBigNumber(ticketSize?.[symbol], config.tokens[symbol].decimals) * avaxPriceInDollars)?.toFixed(2)) || "0")})
                                                                        </>
                                                                    }
                                                                </CustomBtn>
                                                                :
                                                                (winner?.[symbol]?.toLowerCase() !== wallet || BigNumber.from(winner?.[symbol]).eq(0))
                                                                    ? <></>
                                                                    : isClaimed?.[symbol]
                                                                        ?
                                                                        <p className={`${pot.text} text-16 sm:text-18 font-semibold`}>
                                                                            Your reward is claimed.
                                                                        </p>
                                                                        : lastTs?.[symbol]?.toNumber() + claimPeriod?.[symbol]?.toNumber() < (Date.now() / 1000)
                                                                            ?
                                                                            <p className={`${pot.text} text-16 sm:text-18 font-semibold`}>
                                                                                The time for you to claim your reward has expired. You can't claim it anymore.
                                                                            </p>
                                                                            :
                                                                            <CustomBtn
                                                                                color={pot.color}
                                                                                loading={loading?.[symbol]}
                                                                                disabled={Object.values(loading).find(loading => loading)}
                                                                                onClick={async () => await onClaim(symbol)}
                                                                            >
                                                                                You have won! Claim your {separateNumberWithCommas(parseFloat(potSize?.[symbol]?.toFixed(2)))} {symbol}
                                                                                {pot.symbol === Symbol.AVAX &&
                                                                                    <>
                                                                                        {" "}
                                                                                        (${separateNumberWithCommas(parseFloat((potSize?.[symbol] * avaxPriceInDollars)?.toFixed(2)) || "0")})
                                                                                    </>
                                                                                }
                                                                            </CustomBtn>)
                                                        : <div className="flex justify-center items-center"><Loading color={pot.color} /></div>
                                                    }
                                                </EthereumInteraction>
                                            </div>
                                            <p className={`${pot.text} text-16 sm:text-18 font-medium`}>
                                                {response?.[symbol] ? response[symbol] : <><br /></>}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </ContainerWithBgImage>
         </Page>
    )
}