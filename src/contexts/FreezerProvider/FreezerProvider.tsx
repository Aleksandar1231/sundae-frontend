import React, { createContext, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import TombFinance from '../../tomb-finance';
import {Freezer} from "../../tomb-finance/Freezer";
import config from '../../config';
import useTombFinance from "../../hooks/useTombFinance";

export interface FreezerContext {
    freezer?: Freezer;
}

export const Context = createContext<FreezerContext>({ freezer: null });

export const FreezerProvider: React.FC = ({  children }) => {
    const [freezer, setFreezer] = useState<Freezer>();
    const tombFinance = useTombFinance();

    useEffect(() => {
        if (!freezer && tombFinance ) {
            const freezer = new Freezer(tombFinance);
            setFreezer(freezer);
        }
    }, [tombFinance, freezer]);

    return <Context.Provider value={{ freezer }}>{children}</Context.Provider>;
};
