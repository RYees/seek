import { useRef, useEffect, useCallback, createRef } from "react";
import { random } from "@/helpers/functions";

const useRandomInterval = (
    callback: Function,
    minDelay: number | null,
    maxDelay: number | null
) => {
    const timeoutId = useRef<any>(null);
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (minDelay === null || maxDelay === null) return;

        const handleTick = () => {
            const nextTickAt = random(minDelay, maxDelay);

            timeoutId.current = window.setTimeout(() => {
                savedCallback.current();
                handleTick();
            }, nextTickAt);
        };
        handleTick();

        return () => {
            window.clearTimeout(timeoutId.current);
        };
    }, [minDelay, maxDelay]);

    const cancel = useCallback(function () {
        window.clearTimeout(timeoutId.current);
    }, []);

    return cancel;
};

export default useRandomInterval;
