import { QueryPromise } from "@/types";

export const getProfileFeed = (account: string) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const promise: Partial<QueryPromise> = new Promise(async (resolve, reject) => {
        try {
            // TODO: change to real endpoint
            const response = await fetch(`https://whale-app-2lef9.ondigitalocean.app/feed/${account}`, {
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
            // TODO: change to real endpoint
            const response = await fetch(`https://whale-app-2lef9.ondigitalocean.app/posts/${account}`, {
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
            // TODO: change to real endpoint
            const response = await fetch(`https://whale-app-2lef9.ondigitalocean.app/recommended/${account}`, {
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
