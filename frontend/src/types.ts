export interface IAuthContext {
    account: string;
    login: () => void;
    logout: () => void;
}

export interface IProfileCard {
    id: number;
    address: string;
    name: string;
    handle: string;
    bio: string;
    followers: number;
    following: number;
    image: string;
}
