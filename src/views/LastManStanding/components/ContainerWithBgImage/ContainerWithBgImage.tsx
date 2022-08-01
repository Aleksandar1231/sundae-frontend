import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from "react";
import { CSSTransition } from 'react-transition-group';
import classes from "./ContainerWithBgImage.module.scss";
import React from 'react';

interface IContainerWithBgImage {
    bgImg: string;
    bgPos?: string;
    paddingTop?: number | string;
    paddingBottom?: number | string;
    children?: React.ReactNode;
    className?: string;
    bgClassName?: string;
    containerClasses?: string;
    lazyLoadNotNeeded?: boolean;
    subContainerNotNeeded?: boolean;
}

export default function ContainerWithBgImage({
    bgImg,
    bgPos = "bg-center",
    paddingTop,
    paddingBottom,
    children,
    className = "",
    bgClassName = "",
    containerClasses = "",
    lazyLoadNotNeeded,
    subContainerNotNeeded,
    ...rest
}: IContainerWithBgImage): JSX.Element {

    const { ref, inView, entry } = useInView({
        threshold: 0.1,
        rootMargin: "500px"
    });
    const [isLoaded, setIsLoaded] = useState(lazyLoadNotNeeded ? true : false);

    useEffect(() => {
        if (inView) setIsLoaded(true);
    }, [inView]);

    return (
        <CSSTransition in={isLoaded} timeout={1000} classNames="fade">
            <div className={`relative ${containerClasses}`}>
                <div ref={ref} className={`absolute top-0 right-0 bottom-0 left-0 -z-10 bg-cover ${bgClassName} ${bgPos} ${isLoaded ? classes[bgImg] : ""}`} />
                <div
                    className={`${!subContainerNotNeeded ? "container mx-auto px-5" : ""} flex justify-center ${className}`}
                    style={{
                        paddingTop: !subContainerNotNeeded ? paddingTop !== undefined ? paddingTop : 100 : undefined,
                        paddingBottom: !subContainerNotNeeded ? paddingBottom !== undefined ? paddingBottom : 150 : undefined,
                    }}
                    {...rest}
                >
                    {children}
                </div>
            </div>
        </CSSTransition>
    )
}