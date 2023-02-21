export interface IAuthContext {
    user: IUser | null;
    hasProfile: boolean | null;
    userProfile: IUserProfile | null;
    profileTxStatus: IProfileTxStatus;
    profileTxTracker: IProfileTxTracker;
    login: () => void;
    logout: () => void;
    follow: (address: string) => void;
    unfollow: (address: string) => void;
    create: (name: string) => void;
    edit: (name: string, description: string, avatar: string) => void;
    setProfileTxStatus: (status: IProfileTxStatus) => void;
    setProfileTxTracker: (tx: IProfileTxTracker) => void;
}

export interface IProfileCard {
    id?: number;
    address: string;
    name: string;
    description: string;
    followers: any[];
    following: any[];
    avatar: string;
    findName: string;
}

export interface INFTCard {
    id: number;
    image: string;
}

export interface IUser {
    addr: string;
    loggedIn: boolean;
}

export interface IUserProfile {
    address: string;
    avatar: string;
    name: string;
    findName: string;
    description: string;
    followers: IFollower[];
    following: IFollower[];
}

export interface IFollower {
    tags: string[];
    follower: string;
    following: string;
}

export interface INftList {
    user: string;
    project: string;
    id: number;
    views: any[];
}

export interface ILoaderCard {
    status: string;
    error: string;
}

export interface ILoadingCard {
    loading: boolean;
    error: string;
}

export interface IProfileTxStatus {
    create: {
        status: string;
        error: string;
    };
    edit: {
        status: string;
        error: string;
    };
}

export interface IProfileTxTracker {
    create: string;
    edit: string;
}
