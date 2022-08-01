import React from "react";
import useScrollPosition from "../../../hooks/useScrollPosition";
import CustomBtn from "./CustomBtn/CustomBtn";
import Svg from "./Svg";
import { BtnType, Size } from "../types";

export default function ToTop() {
    const { pageYOffset }: any = useScrollPosition();

    return (
        <>
            {pageYOffset >= 700 && (window.innerHeight + window.scrollY) < document.body.scrollHeight &&
                <CustomBtn
                    size={Size.sm}
                    type={BtnType.filled}
                    className={"fixed z-10 bottom-3 right-3 sm:bottom-10 sm:right-10 w-[48px] h-[48px]"}
                    rounded={"rounded-full"}
                    padding={"px-0 py-0"}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <Svg name="arrowUp" width={12} height={16} />
                </CustomBtn>
            }
        </>
    )
}