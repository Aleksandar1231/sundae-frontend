import classes from "./CustomBtn.module.scss";
import Loading from "../Loading/Loading";
import { BtnType, Size } from "../../types";
import { Link } from "react-router-dom";

interface ICustomBtnProps {
    type?: BtnType;
    size?: Size;
    color?: string;
    textColor?: string;
    inverseColor?: string;
    rippleColor?: string;
    padding?: string;
    rounded?: string;
    fontSize?: string;
    className?: string;
    asLink?: boolean;
    href?: string;
    target?: string;
    rel?: string;
    state?: any;
    to?: any;
    loading?: boolean;
    disabled?: boolean;
    onClick?: Function;
    onMouseOver?: Function;
    onMouseLeave?: Function;
    onFocus?: Function;
    onBlur?: Function;
    children?: React.ReactNode;
}

export default function CustomBtn({
    type = BtnType.filled,
    size = Size.lg,
    color = "orange",
    textColor = "white",
    inverseColor = "white",
    rippleColor = "white",
    padding,
    rounded,
    fontSize,
    className,
    asLink,
    href,
    target,
    rel,
    state,
    to,
    loading,
    disabled,
    onClick,
    onMouseOver,
    onMouseLeave,
    onFocus,
    onBlur,
    children,
    ...rest
}: ICustomBtnProps): JSX.Element {
    const bgColors = {
        orange: "bg-orange",
        yellow: "bg-yellow",
        blue: "bg-blue",
        discord: "bg-discord",
        twitter: "bg-twitter",
        telegram: "bg-telegram",
        white: "bg-white",
        black: "bg-black",
        green: "bg-green",
        gray: "bg-gray",
        usdc: "bg-usdc",
        avax: "bg-avax",
        stomb: "bg-stomb",
        slot: "bg-slot",
        grave: "bg-grave",
        gshare: "bg-gshare",
        zombie: "bg-zombie",
        zshare: "bg-zshare",
        wlrs: "bg-wlrs",
        wshare: "bg-wshare",
        grape: "bg-grape",
        wine: "bg-wine",
        glad: "bg-glad",
    };

    const bgColorsHover = {
        orange: "hover:bg-orange",
        yellow: "hover:bg-yellow",
        blue: "hover:bg-blue",
        discord: "hover:bg-discord",
        twitter: "hover:bg-twitter",
        telegram: "hover:bg-telegram",
        white: "hover:bg-white",
        black: "hover:bg-black",
        green: "hover:bg-green",
        gray: "hover:bg-gray",
        usdc: "hover:bg-usdc",
        avax: "hover:bg-avax",
        stomb: "hover:bg-stomb",
        slot: "hover:bg-slot",
        grave: "hover:bg-grave",
        gshare: "hover:bg-gshare",
        zombie: "hover:bg-zombie",
        zshare: "hover:bg-zshare",
        wlrs: "hover:bg-wlrs",
        wshare: "hover:bg-wshare",
        grape: "hover:bg-grape",
        wine: "hover:bg-wine",
        glad: "hover:bg-glad",
    }

    const bgColorsFocus = {
        orange: "focus:bg-orange",
        yellow: "focus:bg-yellow",
        blue: "focus:bg-blue",
        discord: "focus:bg-discord",
        twitter: "focus:bg-twitter",
        telegram: "focus:bg-telegram",
        white: "focus:bg-white",
        black: "focus:bg-black",
        green: "focus:bg-green",
        gray: "focus:bg-gray",
        usdc: "focus:bg-usdc",
        avax: "focus:bg-avax",
        stomb: "focus:bg-stomb",
        slot: "focus:bg-slot",
        grave: "focus:bg-grave",
        gshare: "focus:bg-gshare",
        zombie: "focus:bg-zombie",
        zshare: "focus:bg-zshare",
        wlrs: "focus:bg-wlrs",
        wshare: "focus:bg-wshare",
        grape: "focus:bg-grape",
        wine: "focus:bg-wine",
        glad: "focus:bg-glad",
    }

    const textColors = {
        orange: "text-orange",
        yellow: "text-yellow",
        blue: "text-blue",
        discord: "text-discord",
        twitter: "text-twitter",
        telegram: "text-telegram",
        white: "text-white",
        black: "text-black",
        green: "text-green",
        gray: "text-gray",
        usdc: "text-usdc",
        avax: "text-avax",
        stomb: "text-stomb",
        slot: "text-slot",
        grave: "text-grave",
        gshare: "text-gshare",
        zombie: "text-zombie",
        zshare: "text-zshare",
        wlrs: "text-wlrs",
        wshare: "text-wshare",
        grape: "text-grape",
        wine: "text-wine",
        glad: "text-glad",
    }

    const fillColors = {
        orange: "fill-orange",
        yellow: "fill-yellow",
        blue: "fill-blue",
        discord: "fill-discord",
        twitter: "fill-twitter",
        telegram: "fill-telegram",
        white: "fill-white",
        black: "fill-black",
        green: "fill-green",
        gray: "fill-gray",
        usdc: "fill-usdc",
        avax: "fill-avax",
        stomb: "fill-stomb",
        slot: "fill-slot",
        grave: "fill-grave",
        gshare: "fill-gshare",
        zombie: "fill-zombie",
        zshare: "fill-zshare",
        wlrs: "fill-wlrs",
        wshare: "fill-wshare",
        grape: "fill-grape",
        wine: "fill-wine",
        glad: "fill-glad",
    }

    const borderColors = {
        orange: "border-orange",
        yellow: "border-yellow",
        blue: "border-blue",
        discord: "border-discord",
        twitter: "border-twitter",
        telegram: "border-telegram",
        white: "border-white",
        black: "border-black",
        green: "border-green",
        gray: "border-gray",
        usdc: "border-usdc",
        avax: "border-avax",
        stomb: "border-stomb",
        slot: "border-slot",
        grave: "border-grave",
        gshare: "border-gshare",
        zombie: "border-zombie",
        zshare: "border-zshare",
        wlrs: "border-wlrs",
        wshare: "border-wshare",
        grape: "border-grape",
        wine: "border-wine",
        glad: "border-glad",
    }

    const textInverseColorsHover = {
        white: "hover:text-white",
        lightblue: "hover:text-lightblue",
        green: "hover:text-green",
    }

    const textInverseColorsFocus = {
        white: "focus:text-white",
        lightblue: "focus:text-lightblue",
        green: "focus:text-green",
    }

    const fillInverseColorsHover = {
        white: "hover:fill-white",
        lightblue: "hover:fill-lightblue",
        green: "hover:fill-green",
    }

    const fillInverseColorsFocus = {
        white: "focus:fill-white",
        lightblue: "focus:fill-lightblue",
        green: "focus:fill-green",
    }

    const isActive = !loading && !disabled;

    const typeStyles =
        type === BtnType.filled
            ? `${bgColors[color]} ${isActive && "hover:brightness-90 focus:brightness-90"}
                ${inverseColor !== "white" ? `${textColors[inverseColor]} ${fillColors[inverseColor]}` : `${textColors[textColor]} ${fillColors[textColor]}`}
                ${inverseColor !== "white" && `${fillInverseColorsHover[inverseColor]} ${fillInverseColorsHover[inverseColor]}`}
                ${isActive && classes[color]}`
            : type === BtnType.outlined
                ? `bg-transparent ${isActive && `${bgColorsHover[color]} ${bgColorsFocus[color]}`}
                ${textColors[color]} ${isActive && `${textInverseColorsHover[inverseColor]} ${textInverseColorsFocus[inverseColor]}`}
                ${fillColors[color]} ${isActive && `${fillInverseColorsHover[inverseColor]} ${fillInverseColorsFocus[inverseColor]}`}
                border ${borderColors[color]} border-solid 
                ${isActive && classes[color]}`
                : `bg-transparent transition duration-300
                ${textColors[color]} ${fillColors[color]} ${isActive && `hover:brightness-75 focus:brightness-125`}`;

    const sizeStyles =
        size === Size.lg
            ? `${rounded ? rounded : "rounded-[25px]"} ${padding ? padding : "px-[32px] py-[8px]"} ${fontSize ? fontSize : "text-18"}`
            : `${rounded ? rounded : "rounded-[25px]"} ${padding ? padding : "px-[20px] py-[6px]"} ${fontSize ? fontSize : "text-16"}`;

    const baseStyles = `font-medium flex justify-center items-center ${(loading || disabled) ? "opacity-50 cursor-default" : "cursor-pointer"}`;

    if (asLink) {
        if (to && state)
            return (
                <Link
                    to={to}
                    state={state}
                    className={`${baseStyles} ${typeStyles} ${sizeStyles} ${className}`}
                    onMouseOver={onMouseOver ? () => onMouseOver() : undefined}
                    onMouseLeave={onMouseLeave ? () => onMouseLeave() : undefined}
                    onFocus={onFocus ? () => onFocus() : undefined}
                    onBlur={onBlur ? () => onBlur() : undefined}
                    {...rest}
                >
                    {loading ? <Loading color={type === BtnType.filled ? inverseColor : ""} size={size} /> : children}
                </Link>
            )
        else
            return (
                <a
                    href={href}
                    target={target}
                    rel={rel}
                    className={`${baseStyles} ${typeStyles} ${sizeStyles} ${className}`}
                    onMouseOver={onMouseOver ? () => onMouseOver() : undefined}
                    onMouseLeave={onMouseLeave ? () => onMouseLeave() : undefined}
                    onFocus={onFocus ? () => onFocus() : undefined}
                    onBlur={onBlur ? () => onBlur() : undefined}
                    {...rest}
                >
                    {loading ? <Loading color={type === BtnType.filled ? inverseColor : ""} size={size} /> : children}
                </a>
            );
    }
    else
        return (
            <button
                className={`${baseStyles} ${typeStyles} ${sizeStyles} ${className}`}
                onClick={isActive && onClick ? () => onClick() : undefined}
                onMouseOver={onMouseOver ? () => onMouseOver() : undefined}
                onMouseLeave={onMouseLeave ? () => onMouseLeave() : undefined}
                onFocus={onFocus ? () => onFocus() : undefined}
                onBlur={onBlur ? () => onBlur() : undefined}
                {...rest}
            >
                {loading ? <Loading color={type === BtnType.filled ? inverseColor : ""} size={size} /> : children}
            </button>
        )
}