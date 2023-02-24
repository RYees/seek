import { useState, useEffect } from "react";
import { MEDIA_QUERY } from "@/helpers/constants";

const isRenderingOnServer = typeof window === "undefined";
const getInitialState = () => {
    return isRenderingOnServer ? true : !window.matchMedia(MEDIA_QUERY).matches;
};

function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] =
        useState(getInitialState);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(MEDIA_QUERY);
        const listener = (event: any) => {
            setPrefersReducedMotion(!event.matches);
        };
        mediaQueryList.addEventListener("change", listener);

        return () => {
            mediaQueryList.removeEventListener("change", listener);
        };
    }, []);
    return prefersReducedMotion;
}

export default usePrefersReducedMotion;
