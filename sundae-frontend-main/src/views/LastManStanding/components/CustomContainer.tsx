import React from "react";

interface ICustomContainer {
    color?: string;
    paddingTop?: number | string;
    paddingBottom?: number | string;
    children?: React.ReactNode;
    className?: string;
    containerClasses?: string;
}

export default function CustomContainer({
    color = "light",
    paddingTop,
    paddingBottom,
    children,
    className,
    containerClasses,
    ...rest
}: ICustomContainer): JSX.Element {
    const bgColors = {
        white : "bg-white",
        light: "bg-containerlight",
        medium: "bg-containermedium",
        lightblue: "bg-lightblue",
    }

    return (
        <div className={`flex justify-center ${bgColors[color]} ${containerClasses || ""}`}>
            <div
                className={`flex justify-center container mx-auto px-5 ${className || ""}`}
                style={{ paddingTop: paddingTop !== undefined ? paddingTop : 100, paddingBottom: paddingBottom !== undefined ? paddingBottom : 150 }}
                {...rest}
            >
                {children}
            </div>
        </div>
    )
}