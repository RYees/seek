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
    IProfileTxStatus,
    IProfileTxTracker
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
    profileTxStatus: {
        create: {
            status: "INIT",
            error: "",
        },
        edit: {
            status: "INIT",
            error: "",
        },
    },
    profileTxTracker: {
        create: "",
        edit: ""
    },
    login: async () => { },
    logout: async () => { },
    follow: async () => { },
    unfollow: async () => { },
    create: async () => { },
    edit: async () => { },
    setProfileTxStatus: () => { },
    setProfileTxTracker: () => { },
});

AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [hasProfile, setHasProfile] = useState<boolean | null>(null);
    const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
    const [profileTxStatus, setProfileTxStatus] = useState<IProfileTxStatus>({
        create: {
            status: "INIT",
            error: "",
        },
        edit: {
            status: "INIT",
            error: "",
        },
    });
    const [profileTxTracker, setProfileTxTracker] = useState<IProfileTxTracker>({
        create: "",
        edit: "",
    });
    const [followTxTracker, setFollowTxTracker] = useState<string[]>([]);
    const [trigger, setTrigger] = useState<string>("");

    // Event listener: user changes
    useEffect(() => {
        fcl.currentUser().subscribe(setUser);
    }, []);

    // Event listeners: create/edit profile transactions
    useEffect(() => {
        const keys = Object.keys(profileTxTracker);

        keys.forEach((key: string) => {
            const keyName = key as keyof typeof profileTxTracker;
            const tx = profileTxTracker[keyName];

            if (!tx) return;
            fcl.tx(profileTxTracker[keyName]).subscribe((res: any) => {
                if (res.statusCode === 0) {
                    if (
                        res.statusString === "PENDING"
                        || res.statusString === ""
                        || res.statusString === "EXECUTED") {
                        setProfileTxStatus({
                            ...profileTxStatus,
                            [keyName]: {
                                ...profileTxStatus[keyName],
                                status: "LOADING",
                            }
                        });
                    } else {
                        setProfileTxStatus({
                            ...profileTxStatus,
                            [keyName]: {
                                ...profileTxStatus[keyName],
                                status: "COMPLETED",
                            }
                        });

                        // Trigger a profile update
                        setTrigger(String(Date.now()));
                    }
                } else {
                    setProfileTxStatus({
                        ...profileTxStatus,
                        [keyName]: {
                            ...profileTxStatus[keyName],
                            status: "ERROR",
                        }
                    });

                    // TODO: alert user with the error
                    console.log(res.errorMessage);
                }
            });
        });
    }, [profileTxTracker]);

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
                    setProfileTxStatus({
                        ...profileTxStatus,
                        create: {
                            ...profileTxStatus.create,
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
                    setProfileTxStatus({
                        ...profileTxStatus,
                        create: {
                            ...profileTxStatus.create,
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
        setProfileTxStatus({
            create: {
                status: "INIT",
                error: "",
            },
            edit: {
                status: "INIT",
                error: "",
            }
        });
        setProfileTxTracker({
            create: "",
            edit: ""
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
            setProfileTxTracker({
                ...profileTxTracker,
                create: transactionID
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
            setProfileTxTracker({
                ...profileTxTracker,
                edit: transactionID
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
            profileTxStatus,
            profileTxTracker,
            login,
            logout,
            follow,
            unfollow,
            create,
            edit,
            setProfileTxStatus,
            setProfileTxTracker
        }}>
            {children}
        </AuthContext.Provider>
    );
};
