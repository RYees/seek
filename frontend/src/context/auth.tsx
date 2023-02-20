import {
    ReactNode,
    createContext,
    useEffect,
    useState,
} from "react";
// @ts-ignore
import * as fcl from "@onflow/fcl";
// @ts-ignore
import * as types from "@onflow/types";
import {
    IAuthContext,
    IUser,
    IUserProfile,
    ICreateProfileStatus,
    ICreateProfileTXs
} from "@/types";
import { reverseLookup } from "@/cadence/scripts/reverseLookup";
import { getProfile } from "@/cadence/scripts/getProfile";
import { Follow } from "@/cadence/transactions/Follow";
import { Unfollow } from "@/cadence/transactions/Unfollow";
import { CreateProfile } from "@/cadence/transactions/CreateProfile";
import { EditProfile } from "@/cadence/transactions/EditProfile";

fcl.config({
    "flow.network": process.env.NEXT_PUBLIC_FLOW_NETWORK,
    "app.detail.title": process.env.NEXT_PUBLIC_APP_DETAIL_TITLE,
    "accessNode.api": process.env.NEXT_PUBLIC_ACCESS_NODE_API,
    "app.detail.icon": process.env.NEXT_PUBLIC_APP_DETAIL_ICON,
    "discovery.wallet": process.env.NEXT_PUBLIC_DISCOVERY_WALLET,
});

export const AuthContext = createContext<IAuthContext>({
    user: null,
    hasProfile: false,
    userProfile: null,
    createProfileStatus: {
        name: {
            status: "INIT",
            error: "",
        },
        info: {
            status: "INIT",
            error: "",
        }
    },
    createProfileTXs: {
        name: "",
        info: ""
    },
    login: async () => { },
    logout: async () => { },
    follow: async () => { },
    unfollow: async () => { },
    create: async () => { },
    edit: async () => { },
    setCreateProfileStatus: () => { },
    setCreateProfileTXs: () => { },
});

AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [hasProfile, setHasProfile] = useState<boolean | null>(null);
    const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
    const [createProfileStatus, setCreateProfileStatus] = useState<ICreateProfileStatus>({
        name: {
            status: "INIT",
            error: "",
        },
        info: {
            status: "INIT",
            error: "",
        }
    });
    const [createProfileTXs, setCreateProfileTXs] = useState<ICreateProfileTXs>({
        name: "",
        info: ""
    });
    const [trigger, setTrigger] = useState<string>("");

    // Event listener for user changes
    useEffect(() => {
        fcl.currentUser().subscribe(setUser);
        console.log("From fcl");
        console.log(user);
    }, []);

    // Event listener for transaction updates
    useEffect(() => {
        const keys = Object.keys(createProfileTXs);

        keys.forEach((key: string) => {
            const keyName = key as keyof typeof createProfileTXs;
            const tx = createProfileTXs[keyName];

            if (!tx) return;
            fcl.tx(createProfileTXs[keyName]).subscribe((res: any) => {
                if (res.statusCode === 0) {
                    if (
                        res.statusString === "PENDING"
                        || res.statusString === ""
                        || res.statusString === "EXECUTED") {
                        setCreateProfileStatus({
                            ...createProfileStatus,
                            [keyName]: {
                                ...createProfileStatus[keyName],
                                status: "LOADING",
                            }
                        });
                    } else {
                        setCreateProfileStatus({
                            ...createProfileStatus,
                            [keyName]: {
                                ...createProfileStatus[keyName],
                                status: "COMPLETED",
                            }
                        });

                        // Trigger a profile update
                        setTrigger(String(Date.now()));
                    }
                } else {
                    setCreateProfileStatus({
                        ...createProfileStatus,
                        [keyName]: {
                            ...createProfileStatus[keyName],
                            status: "ERROR",
                        }
                    });

                    // TODO: alert user with the error
                    console.log(res.errorMessage);
                }
            });
        });
    }, [createProfileTXs]);

    // Get user profile
    useEffect(() => {
        // Reset
        setUserProfile(null);

        async function fetchProfile() {
            if (!user?.addr) return;

            try {
                const res = await fcl.query({
                    cadence: `${getProfile}`,
                    args: (arg: any, t: any) => [
                        arg(user.addr, types.Address),
                    ],
                });

                // Update state variables
                setUserProfile(res);

                // Update create profile status
                if (res.name) {
                    setCreateProfileStatus({
                        ...createProfileStatus,
                        name: {
                            ...createProfileStatus.name,
                            status: "COMPLETED",
                        }
                    });
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchProfile();
    }, [user]);

    // Update profile
    useEffect(() => {
        if (!trigger) return;

        async function fetchProfile() {
            if (!user?.addr) return;

            try {
                const res = await fcl.query({
                    cadence: `${getProfile}`,
                    args: (arg: any, t: any) => [
                        arg(user.addr, types.Address),
                    ],
                });

                // Update state variables
                setUserProfile(res);

                // Update create profile status
                if (res.name) {
                    setCreateProfileStatus({
                        ...createProfileStatus,
                        name: {
                            ...createProfileStatus.name,
                            status: "COMPLETED",
                        }
                    });
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchProfile();
    }, [trigger, user]);

    // Check if user has domain name
    useEffect(() => {
        // Reset 
        setHasProfile(null);

        async function checkHasProfile() {
            if (!user?.addr) return;

            try {
                const res = await fcl.query({
                    cadence: `${reverseLookup}`,
                    args: (arg: any, t: any) => [
                        arg(user.addr, types.Address),
                    ],
                });

                // Update state variables
                setHasProfile(Boolean(res));
            } catch (err) {
                console.error(err);
            }
        }
        checkHasProfile();
    }, [user]);

    const login = async () => {
        const res = await fcl.authenticate();
        setUser(res);
    };

    const logout = async () => {
        await fcl.unauthenticate();
        setUser(null);
        setHasProfile(null);
        setUserProfile(null);
        setCreateProfileStatus({
            name: {
                status: "INIT",
                error: "",
            },
            info: {
                status: "INIT",
                error: "",
            }
        });
        setCreateProfileTXs({
            name: "",
            info: ""
        });
    };

    const follow = async (address: string) => {
        if (!userProfile) return;
        if (!address) return;

        try {
            const transactionID = await fcl.mutate({
                cadence: `${Follow}`,
                args: (arg: any, t: any) => [
                    arg(
                        [{ key: address, value: [] }],
                        types.Dictionary({ key: types.String, value: types.Array(types.String) }))
                ],
                proposer: fcl.currentUser,
                payer: fcl.currentUser,
                limit: 9999
            });
            console.log("Success! Followed with TX ID: ", transactionID);
        } catch (error) {
            console.error(error);
        }
    }

    const unfollow = async (address: string) => {
        if (!userProfile) return;
        if (!address) return;

        try {
            const transactionID = await fcl.mutate({
                cadence: `${Unfollow}`,
                args: (arg: any, t: any) => [
                    arg([address], types.Array(types.String))
                ],
                proposer: fcl.currentUser,
                payer: fcl.currentUser,
                limit: 9999
            });

            // Log transaction ID
            console.log("Success! Unfollowed with TX ID: ", transactionID);
        } catch (error) {
            console.error(error);
        }
    }

    const create = async (name: string) => {
        if (!user?.addr) return;

        try {
            const transactionID = await fcl.mutate({
                cadence: `${CreateProfile}`,
                args: (arg: any, t: any) => [
                    arg(name, types.String),
                ],
                proposer: fcl.currentUser,
                payer: fcl.currentUser,
                limit: 9999
            });

            // Trigger the event listener
            setCreateProfileTXs({
                ...createProfileTXs,
                name: transactionID
            });
        } catch (error) {
            console.error(error);
        }
    }

    const edit = async (
        name: string,
        description: string,
        avatar: string,
    ) => {
        if (!user?.addr) return;

        try {
            const transactionID = await fcl.mutate({
                cadence: `${EditProfile}`,
                args: (arg: any, t: any) => [
                    arg(name, types.String),
                    arg(description, types.String),
                    arg(avatar, types.String),
                    arg([], types.Array(types.String)),
                    arg(true, types.Bool),
                    arg([{ key: "", value: "" }], types.Dictionary({ key: types.String, value: types.String })),
                    arg([{ key: "", value: "" }], types.Dictionary({ key: types.String, value: types.String })),
                    arg([{ key: "", value: "" }], types.Dictionary({ key: types.String, value: types.String })),
                    arg([], types.Array(types.String)),
                ],
                proposer: fcl.currentUser,
                payer: fcl.currentUser,
                limit: 9999
            });

            // Trigger the event listener
            setCreateProfileTXs({
                ...createProfileTXs,
                info: transactionID
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            hasProfile,
            userProfile,
            createProfileStatus,
            createProfileTXs,
            login,
            logout,
            follow,
            unfollow,
            create,
            edit,
            setCreateProfileStatus,
            setCreateProfileTXs
        }}>
            {children}
        </AuthContext.Provider>
    );
};
