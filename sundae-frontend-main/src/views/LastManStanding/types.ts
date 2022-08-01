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
    GRAPE = "GRAPE",
    FUDGE = "FUDGE",
    STRAW = "STRAW",
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