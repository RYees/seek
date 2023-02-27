import { IFPS_GATEWAY } from "@/helpers/constants";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import FormData from "form-data";

const JWT = process.env.NEXT_PUBLIC_PINATA_JWT || "";

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

export const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min)) + min;

export const range = (start: number, end?: number, step: number = 1) => {
    let output = [];
    if (typeof end === "undefined") {
        end = start;
        start = 0;
    }
    for (let i = start; i < end; i += step) {
        output.push(i);
    }
    return output;
};

export const fileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export const pinFileToIPFS = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const fileId = uuidv4();
    const metadata = JSON.stringify({
        id: fileId,
        name: `post-image-${fileId}`,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
        const res = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
                maxBodyLength: Number("Infinity"),
                headers: {
                    "Content-Type": `multipart/form-data;`,
                    Authorization: `Bearer ${JWT}`,
                },
            }
        );
        return res.data.IpfsHash;
    } catch (error) {
        throw error;
    }
};
