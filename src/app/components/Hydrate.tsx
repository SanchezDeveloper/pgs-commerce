'use client'

import { ReactNode, useState, useEffect } from "react"

export default function Hydrate ({ children }: {children: ReactNode}) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return isMounted ? <>{children}</> : <span className="flex justify-center items-center mt-52">carregando...</span>;
}