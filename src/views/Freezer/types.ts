import React from "react";

export enum Size {
    sm = "sm",
    lg = "lg",
}

export enum BtnType {
    filled = "filled",
    outlined = "outlined",
    linkLike = "linkLike",
}

export enum Position {
    top = "top",
    right = "right",
    bottom = "bottom",
    left = "left",
}

export enum Symbol {
    AVAX = "AVAX",
    WAVAX = "WAVAX",
    USDC = "USDC",
    USDT = "USDT",
    STOMB = "STOMB",
    SLOT = "SLOT",
    GRAVE = "GRAVE",
    GSHARE = "GSHARE",
    ZOMBIE = "ZOMBIE",
    ZSHARE = "ZSHARE",
    WLRS = "WLRS",
    WSHARE = "WSHARE",
    GRAPE = "GRAPE",
    WINE = "WINE",
    SIFU = "SIFU",
    ASTRO = "ASTRO",
    GAME = "GAME",
    TOMB = "GLAD",
    TSHARE= "GLADSHARE",
    TOMB_AVAX_LP = 'GLAD-AVAX LP',
    TOMB_TSHARE_LP = 'GLAD-GLADSHARE LP',
    TSHARE_AVAX_LP = 'GLADSHARE-AVAX LP',
    TSHARE_TOMB_LP = 'GLADSHARE-GLAD LP',
}

export interface Link {
    name: string;
    href: string;
    component?: React.ReactNode;
    target?: string;
    rel?: string;
    disabled?: boolean;
    highlighted?: boolean;
}

export interface DynamicObject<T> {
    [key: string]: T;
}