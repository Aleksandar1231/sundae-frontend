import React from "react";
import useMediaQuery from "../../../../hooks/useMediaQuery";
import { Size } from "../../types";
import classes from "./Loading.module.scss";

interface Appearance {
    color?: string;
    size?: Size;
}

export default function Loading({ color = "orange", size }: Appearance): JSX.Element {
    const bp640px = useMediaQuery(640);

    const colors = {
        white: "border-t-white",
        orange: "border-t-orange",
        usdc: "border-t-usdc",
        avax: "border-t-avax",
        stomb: "border-t-stomb",
        slot: "border-t-slot",
        grave: "border-t-grave",
        gshare: "border-t-gshare",
        zombie: "border-t-zombie",
        zshare: "border-t-zshare",
        wlrs: "border-t-wlrs",
        wshare: "border-t-wshare",
        grape: "border-t-grape",
        wine: "border-t-wine",
        glad: "border-t-glad",
    }

    return (
        <div
            className={classes.ldsRing}
            style={{
                width: size === Size.sm ? 23 : bp640px ? 30 : 20,
                height: size === Size.sm ? 23 : bp640px ? 30 : 20,
            }}
        >
            {[0, 1, 2, 3].map(d => {
                return (
                    <div
                        key={d.toString()}
                        className={`${colors[color]} border-r-transparent border-b-transparent border-l-transparent`}
                        style={{
                            width: size === Size.sm ? 23 : bp640px ? 30 : 20,
                            height: size === Size.sm ? 23 : bp640px ? 30 : 20,
                        }}
                    />
                )
            })}
        </div>
    )
}