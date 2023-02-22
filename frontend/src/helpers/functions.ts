import { INftList } from "@/types";
import { MAX_NUM_OF_NFT, NFT_CATALOG, IFPS_GATEWAY } from "@/helpers/constants";

export const intlCompactNumFormat = function (
    num: number,
    locale: string = "en-US"
) {
    return new Intl.NumberFormat(locale, {
        notation: "compact",
        compactDisplay: "short",
    }).format(num);
};

export const timeSince = (date: number) => {
    const now = new Date() as any;
    const seconds = Math.floor((now - date) / 1000);
    let interval;

    interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + "y";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + "mo";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + "d";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + "h";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + "m";
    }
    return Math.floor(seconds) + "s";
};

export const orderNFTs = (catalog: any, account: string) => {
    let count = 0;
    const orderedNFTs: INftList[] = [];
    const collections: string[] = NFT_CATALOG;
    const keys = Object.keys(catalog);

    // Check if there are no collections
    if (keys.length === 0) return [];

    // Loop through the nft catalog
    for (let i = 0; i < collections.length; i++) {
        // Get the collection name
        const collectionName = collections[i];

        // Check the number of NFTs
        if (count >= MAX_NUM_OF_NFT) break;

        // Check if the collection is in the catalog
        if (keys.includes(collectionName)) {
            const extraIDs = catalog[collectionName]?.extraIDs;
            for (let i = 0; i < extraIDs.length; i++) {
                if (count >= MAX_NUM_OF_NFT) break;
                orderedNFTs.push({
                    user: account,
                    project: collectionName,
                    id: Number(extraIDs[i]),
                    views: [],
                });
                count++;
            }
        }
    }

    // // Loop through the rest of the collections
    // for (let i = 0; i < keys.length; i++) {
    //     // Get the collection name
    //     const collectionName = keys[i];

    //     // Check the number of NFTs
    //     if (count >= MAX_NUM_OF_NFT) break;

    //     // Check if the collection is in the priority collections
    //     if (!collections.includes(collectionName)) {
    //         const extraIDs = catalog[collectionName]?.extraIDs;
    //         for (let i = 0; i < extraIDs.length; i++) {
    //             if (count >= MAX_NUM_OF_NFT) break;
    //             orderedNFTs.push({
    //                 user: account,
    //                 project: collectionName,
    //                 id: Number(extraIDs[i]),
    //                 views: [],
    //             });
    //             count++;
    //         }
    //     }
    // }

    return orderedNFTs;
};

export const parseURL = (url: string) => {
    let parsedURL = url;

    if (url.includes("ipfs")) {
        if (url.includes("ipfs://")) {
            parsedURL = `${IFPS_GATEWAY}/${url.slice(7)}`;
        } else {
            const index = url.indexOf("ipfs/");
            const slice = index ? index + 5 : index + 6;
            const str = url.slice(slice, url.length);

            parsedURL = `${IFPS_GATEWAY}/${str}`;
        }
    }

    return parsedURL;
};

type ErrorWithMessage = {
    message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as Record<string, unknown>).message === "string"
    );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
    if (isErrorWithMessage(maybeError)) return maybeError;

    try {
        return new Error(JSON.stringify(maybeError));
    } catch {
        // fallback in case there's an error stringifying the maybeError
        // like with circular references for example.
        return new Error(String(maybeError));
    }
}

export function getErrorMessage(error: unknown) {
    return toErrorWithMessage(error).message;
}

export const isAbortError = (error: unknown) => {
    const message = getErrorMessage(error);
    if (error && message === "AbortError") {
        return true;
    }
    return false;
};
