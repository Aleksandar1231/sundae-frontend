import './index.css';

import React, { useState, useEffect, useMemo } from 'react'
import { useWallet } from 'use-wallet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Page from '../../components/Page';
import UnlockWallet from '../../components/UnlockWallet';
import useTombFinance from '../../hooks/useTombFinance';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';
import { Box, Container, Typography, TextField, Button } from '@material-ui/core';

const Slots = () => {
    const tombFinance = useTombFinance();
    const tombBalance = useTokenBalance(tombFinance.TOMB);
    const initBalance = getDisplayBalance(tombBalance);
    const displayTombBalance = useMemo(() => getDisplayBalance(tombBalance), [tombBalance]);
    const [spin, setSpin] = useState(false)
    const [ring1, setRing1] = useState()
    const [ring2, setRing2] = useState()
    const [ring3, setRing3] = useState()
    const [price, setPrice] = useState()
    const [input, setInput] = useState()
    const [realBet, setRealBet] = useState()
    const [jackpot, setJackpot] = useState(0)
    const [balance, setBalance] = useState(initBalance)

    useEffect(() => {
        win()
    }, [ring3])


    function row1() {

        if (!spin) {
            return (
                <>
                    <div className="ringEnd">🍓</div>
                    <div className="ringEnd">🍇</div>
                    <div className="ringEnd">🍊</div>
                    <div className="ringEnd">🥭</div>
                </>
            )
        } else if (spin && ring1 == undefined) {
            return (
                <>
                    <div className="ringMoving">🍓</div>
                    <div className="ringMoving">🍇</div>
                    <div className="ringMoving">🍊</div>
                    <div className="ringMoving">🥭</div>
                </>
            )
        } else if (ring1 >= 1 && ring1 <= 50) {
            return (
                <>
                    <div className="ringEnd">🍓</div>
                    <div className="ringEnd">🍇</div>
                    <div className="ringEnd">🍊</div>
                    <div className="ringEnd">🥭</div>
                </>
            )
        } else if (ring1 > 50 && ring1 <= 75) {
            return (
                <>
                    <div className="ringEnd">🍇</div>
                    <div className="ringEnd">🍊</div>
                    <div className="ringEnd">🥭</div>
                    <div className="ringEnd">🍓</div>
                </>
            )
        } else if (ring1 > 75 && ring1 <= 95) {
            return (
                <>
                    <div className="ringEnd">🍊</div>
                    <div className="ringEnd">🥭</div>
                    <div className="ringEnd">🍓</div>
                    <div className="ringEnd">🍇</div>
                </>
            )
        } else if (ring1 > 95 && ring1 <= 100) {
            return (
                <>
                    <div className="ringEnd">🥭</div>
                    <div className="ringEnd">🍓</div>
                    <div className="ringEnd">🍇</div>
                    <div className="ringEnd">🍊</div>
                </>
            )
        }
    }

    function row2() {

        if (!spin) {
            return (
                <>
                    <div className="ringEnd">🥭</div>
                    <div className="ringEnd">🍓</div>
                    <div className="ringEnd">🍇</div>
                    <div className="ringEnd">🍊</div>
                </>
            )
        } else if (spin && ring2 == undefined) {
            return (
                <>
                    <div className="ringMoving">🍓</div>
                    <div className="ringMoving">🍇</div>
                    <div className="ringMoving">🍊</div>
                    <div className="ringMoving">🥭</div>
                </>
            )
        } else if (ring2 >= 1 && ring2 <= 50) {
            return (
                <>
                    <div className="ringEnd">🍓</div>
                    <div className="ringEnd">🍇</div>
                    <div className="ringEnd">🍊</div>
                    <div className="ringEnd">🥭</div>
                </>
            )
        } else if (ring2 > 50 && ring2 <= 75) {
            return (
                <>
                    <div className="ringEnd">🍇</div>
                    <div className="ringEnd">🍊</div>
                    <div className="ringEnd">🥭</div>
                    <div className="ringEnd">🍓</div>
                </>
            )
        } else if (ring2 > 75 && ring2 <= 95) {
            return (
                <>
                    <div className="ringEnd">🍊</div>
                    <div className="ringEnd">🥭</div>
                    <div className="ringEnd">🍓</div>
                    <div className="ringEnd">🍇</div>
                </>
            )
        } else if (ring2 > 95 && ring2 <= 100) {
            return (
                <>
                    <div className="ringEnd">🥭</div>
                    <div className="ringEnd">🍓</div>
                    <div className="ringEnd">🍇</div>
                    <div className="ringEnd">🍊</div>
                </>
            )
        }

    }

    function row3() {

        if (!spin) {
            return (
                <>
                    <div className="ringEnd">🥭</div>
                    <div className="ringEnd">🍓</div>
                    <div className="ringEnd">🍇</div>
                    <div className="ringEnd">🍊</div>
                </>
            )
        } else if (spin && ring3 == undefined) {
            return (
                <>
                    <div className="ringMoving">🍓</div>
                    <div className="ringMoving">🍇</div>
                    <div className="ringMoving">🍊</div>
                    <div className="ringMoving">🍋</div>
                    <div className="ringMoving">🍍</div>
                    <div className="ringMoving">🥭</div>
                </>
            )
        } else if (ring3 >= 1 && ring3 <= 50) {
            return (
                <>
                    <div className="ringEnd">🍓</div>
                    <div className="ringEnd">🍇</div>
                    <div className="ringEnd">🍊</div>
                    <div className="ringEnd">🥭</div>
                </>
            )
        } else if (ring3 > 50 && ring3 <= 75) {
            return (
                <>
                    <div className="ringEnd">🍇</div>
                    <div className="ringEnd">🍊</div>
                    <div className="ringEnd">🥭</div>
                    <div className="ringEnd">🍓</div>
                </>
            )
        } else if (ring3 > 75 && ring3 <= 95) {
            return (
                <>
                    <div className="ringEnd">🍊</div>
                    <div className="ringEnd">🥭</div>
                    <div className="ringEnd">🍓</div>
                    <div className="ringEnd">🍇</div>
                </>
            )
        } else if (ring3 > 95 && ring3 <= 100) {
            return (
                <>
                    <div className="ringEnd">🥭</div>
                    <div className="ringEnd">🍓</div>
                    <div className="ringEnd">🍇</div>
                    <div className="ringEnd">🍊</div>
                </>
            )
        }
    }

    function win() {
        if (ring1 <= 50 && ring2 <= 50 && ring3 <= 50 && ring1 != undefined) {
            setPrice(1)
        } else if (ring1 > 50 && ring1 <= 75 && ring2 > 50 && ring2 <= 75 && ring3 > 50 && ring3 <= 75 && ring1 != undefined) {
            setPrice(2)
        } else if (ring1 > 75 && ring1 <= 95 && ring2 > 75 && ring2 <= 95 && ring3 > 75 && ring3 <= 95 && ring1 != undefined) {
            setPrice(3)
        } else if (ring1 > 95 && ring1 <= 100 && ring2 > 95 && ring2 <= 100 && ring3 > 95 && ring3 <= 100 && ring1 != undefined) {
            setPrice(4)
        } else {
            setPrice(0)
        }
    }

    function rand() {
        setRing1(Math.floor(Math.random() * (100 - 1) + 1))
        setTimeout(function () { setRing2(Math.floor(Math.random() * (100 - 1) + 1)) }, 1000)
        setTimeout(function () { setRing3(Math.floor(Math.random() * (100 - 1) + 1)) }, 2000)
    }

    function play() {
        if (ring3 > 1 || !spin) {
            if (input <= balance && input >= 1) {
                setRealBet(input)
                setSpin(true)
                setRing1()
                setRing2()
                setRing3()
                setBalance(balance - input)
                setJackpot(jackpot + (input / 2))
                setTimeout(function () {
                    rand()
                }, 2000)
            } else {
                setPrice(10)
            }

        }
    }


    function win() {
        if (ring1 <= 50 && ring2 <= 50 && ring3 <= 50 && ring1 != undefined) {
            setPrice(1)
            setBalance(balance + (balance * 15))
        } else if (ring1 > 50 && ring1 <= 75 && ring2 > 50 && ring2 <= 75 && ring3 > 50 && ring3 <= 75 && ring1 != undefined) {
            setPrice(2)
            setBalance(balance + (balance * 20))
        } else if (ring1 > 75 && ring1 <= 95 && ring2 > 75 && ring2 <= 95 && ring3 > 75 && ring3 <= 95 && ring1 != undefined) {
            setPrice(3)
            setBalance(balance + (balance * 25))
        } else if (ring1 > 95 && ring1 <= 100 && ring2 > 95 && ring2 <= 100 && ring3 > 95 && ring3 <= 100 && ring1 != undefined) {
            setPrice(4)
            setBalance(balance + jackpot)
            setJackpot(0)
        } else {
            setPrice(0)
        }
    }

    function premio() {
        if (price === 1 && ring3 > 1) {
            return (
                <p className="priceInd">{"🍇 X15 You've won " + (realBet * 15) + "€!"}</p>
            )
        } else if (price === 2 && ring3 > 1) {
            return (
                <p className="priceInd">{"🍊 X20 You've won " + (realBet * 20) + "€!"}</p>
            )
        } else if (price === 3 && ring3 > 1) {
            return (
                <p className="priceInd">{"🥭 X25 You've won " + (realBet * 25) + "€!"}</p>
            )
        } else if (price === 4 && ring3 > 1) {
            return (
                <p className="priceInd">{"🍓 Jackpot! You've won: " + (jackpot) + "€!"}</p>
            )
        } else if (price === 0 && ring3 > 1) {
            return (
                <p className="priceInd">😧 ¡So close! But no luck...</p>
            )
        } else if (price === 10) {
            return (
                <p className="priceInd">🥶 <span style={{ color: `red` }}>Not enough funds</span> </p>
            )
        } else {
            return (
                <p className="priceInd">🥭 Take her for a spin</p>
            )
        }
    }

    function numChecker(e) {
        const value = e.target.value;
        const regex = /^[0-9]+$/;
        if (value.match(regex) && parseInt(value) >= 0 || value === "") {
            setInput(value);
        }
    }

    const { account } = useWallet();

    return (
        <Switch>
            <Page>

                {!!account ? (
                    <>

                        <Container alignItems='center' maxWidth="lg" className="fullSlot" style={{ marginTop: '2rem' }}>
                            <h1 className="casinoName">Casino Sundae</h1>
                            <Box>
                                <h1 className="price">{"Jackpot: " + jackpot + " FUDGE"}</h1>
                            </Box>

                            <Box className="slot">
                                <Box className="row">
                                    {row1()}
                                </Box>
                                <Box className="row">
                                    {row2()}
                                </Box>
                                <Box className="row">
                                    {row3()}
                                </Box>
                            </Box>
                            <Box className="price">
                                <h1>
                                    {premio()}
                                </h1>
                            </Box>
                            <Box className="slotFoot" alignContent={'center'}>
                                <TextField value={input} onChange={(e) => numChecker(e)} variant="outlined" className="betInput" placeholder="0 Fudge" />
                                <Button color="primary" variant="contained" className="spinButton" onClick={() => play()}>Spin</Button>
                            </Box>
                            <h1 className="price">{"Available Fudge: " + displayTombBalance}</h1>
                            <Button color="primary" variant="contained" onClick={() => setBalance(balance + 1000)} className="buyMoreButton">Add FUDGE</Button>
                        </Container>
                    </>
                ) : (
                    <UnlockWallet />
                )
                }
            </Page >
        </Switch >

    )
}

export default Slots;