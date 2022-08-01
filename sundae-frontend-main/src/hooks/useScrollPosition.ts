import { useEffect, useState } from "react";

export default function useScrollPosition() {
    const [pageOffset, setPageOffset] = useState({ pageXOffset: 0, pageYOffset: 0 });

    const handleScroll = () => setPageOffset({ pageXOffset: window.pageXOffset, pageYOffset: window.pageYOffset });

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return pageOffset;
}