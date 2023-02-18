export interface IAuthContext {
    user: IUser | null;
    login: () => void;
    logout: () => void;
}

export interface IProfileCard {
    id?: number;
    address: string;
    name: string;
    description: string;
    followers: any[];
    following: any[];
    avatar: string;
}

export interface INFTCard {
    id: number;
    image: string;
}

export interface IUser {
    addr: string;
    loggedIn: boolean;
}

export interface INftList {
    user: string;
    project: string;
    id: number;
    views: any[];
}
