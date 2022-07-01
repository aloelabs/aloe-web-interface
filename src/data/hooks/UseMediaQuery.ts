import { useEffect, useState } from 'react';

export default function useMediaQuery(minWidth: number) {
    const [isMinWidth, setIsMinWidth] = useState(window.innerWidth > minWidth);
    
    useEffect(() => {
        const handleResize = () => {
            setIsMinWidth(window.innerWidth > minWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [minWidth]);
    
    return isMinWidth;
}