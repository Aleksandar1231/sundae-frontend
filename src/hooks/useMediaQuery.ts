import { useState, useEffect } from 'react';

export default function useMediaQuery(breakPoint: number): boolean {
    const [isBiggerOrEqual, setIsBiggerOrEqual] = useState(window.innerWidth >= breakPoint);

    useEffect(() => {
        const handleResize = () => setIsBiggerOrEqual(window.innerWidth >= breakPoint);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isBiggerOrEqual;
}