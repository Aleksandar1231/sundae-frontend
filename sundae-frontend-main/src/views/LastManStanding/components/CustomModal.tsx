import React from "react";
import { useEffect, useRef } from "react";
import close from "../assets/images/close.svg";

interface ICustomModal {
    open: boolean;
    setOpen: Function;
    children: React.ReactNode;
    padding?: string;
}

export default function CustomModal({
    open,
    setOpen,
    children,
    padding = "px-6 sm:px-12 py-12",
}: ICustomModal): JSX.Element {
    const ref = useRef();

    useEffect(() => {
        const hideModal = (e) => {
            if (e.target === ref?.current) setOpen(false);
        };
        window.addEventListener("mousedown", hideModal);
        return () => window.removeEventListener("mousedown", hideModal);
    }, [ref]);

    return (
        <div
            ref={ref}
            className={`${open ? "flex" : "hidden"} fixed z-50 left-0 top-0 w-full h-full overflow-auto bg-black bg-opacity-40 justify-center items-center`}
        >
            <div className={`bg-white bg-opacity-90 mx-3 my-auto sm:m-auto ${padding} border border-solid border-lightsky rounded-[10px]
                w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-1/3 relative`}>
                <img
                    src={close}
                    alt=""
                    width={15}
                    height={15}
                    className="absolute top-4 right-4 opacity-50 hover:opacity-100 cursor-pointer"
                    onClick={() => setOpen(false)}
                />
                {children}
            </div>
        </div>
    )
}