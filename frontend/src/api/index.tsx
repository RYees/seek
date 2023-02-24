import { QueryPromise } from "@/types";
import { ENDPOINT } from "@/helpers/constants";

export const getProfileFeed = (account: string) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const promise: Partial<QueryPromise> = new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${ENDPOINT}/feed/${account}`, {
                method: "get",
                signal,
            });
            const data = await response.json();
            if (data.success) {
                resolve(data["data"]);
            } else {
                reject(Error(data["message"]));
            }
        } catch (error) {
            reject(error);
        }
    });
    promise.cancel = () => controller.abort();
    return promise;
}

export const getProfilePosts = (account: string) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const promise: Partial<QueryPromise> = new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${ENDPOINT}/posts/${account}`, {
                method: "get",
                signal,
            });
            const data = await response.json();
            if (data.success) {
                resolve(data["data"]);
            } else {
                reject(Error(data["message"]));
            }
        } catch (error) {
            reject(error);
        }
    });
    promise.cancel = () => controller.abort();
    return promise;
}

export const getProfileRecommended = (account: string) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const promise: Partial<QueryPromise> = new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${ENDPOINT}/recommended/${account}`, {
                method: "get",
                signal,
            });
            const data = await response.json();
            if (data.success) {
                resolve(data["data"]);
            } else {
                reject(Error(data["message"]));
            }
        } catch (error) {
            reject(error);
        }
    });
    promise.cancel = () => controller.abort();
    return promise;
}
