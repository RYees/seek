import {
    ReactNode,
    createContext,
    useEffect,
    useState,
    useContext
} from "react";
// @ts-ignore
import * as fcl from "@onflow/fcl";
// @ts-ignore
import * as types from "@onflow/types";
import {
    IActionsContext,
    IProfileTxStatus,
    IProfileTxTracker
} from "@/types";
import { Follow } from "@/cadence/transactions/Follow";
import { Unfollow } from "@/cadence/transactions/Unfollow";
import { CreateProfile } from "@/cadence/transactions/CreateProfile";
import { EditProfile } from "@/cadence/transactions/EditProfile";
import { PublishThought } from "@/cadence/transactions/PublishThought";
import { ModalContext } from "./modal";
import { AuthContext } from "./auth";

export const ActionsContext = createContext<IActionsContext>({
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
    follow: async () => { },
    unfollow: async () => { },
    create: async () => { },
    edit: async () => { },
    post: async () => { },
    setProfileTxStatus: () => { },
    setProfileTxTracker: () => { },
});

ActionsContext.displayName = "ActionsContext";

export const ActionsProvider = ({ children }: { children: ReactNode }) => {
    const { user, userProfile } = useContext(AuthContext);
    const { handleModal } = useContext(ModalContext);
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
                        // setTrigger(String(Date.now()));
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
    const follow = async (address: string) => {
        if (!user?.loggedIn) {
            alert("Please connect wallet first.");
            return;
        }
        if (!userProfile) {
            alert("Please create a profile first.");
            return;
        }
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

            // Open the modal to show the transaction status
            handleModal({
                action: "FOLLOW",
                transactionID: transactionID
            });
        } catch (error) {
            console.error(error);
        }
    }

    const unfollow = async (address: string) => {
        if (!user?.loggedIn) {
            alert("Please connect wallet first.");
            return;
        }
        if (!userProfile) {
            alert("Please create a profile first.");
            return;
        }
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

            // Open the modal to show the transaction status
            handleModal({
                action: "UNFOLLOW",
                transactionID: transactionID
            });
        } catch (error) {
            console.error(error);
        }
    }

    const create = async (name: string) => {
        if (!user?.loggedIn) {
            alert("Please connect wallet first.");
            return;
        }

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

            // Open the modal to show the transaction status
            handleModal({
                action: "CREATE",
                transactionID: transactionID
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
        if (!user?.loggedIn) {
            alert("Please connect wallet first.");
            return;
        }
        if (!userProfile) {
            alert("Please create a profile first.");
            return;
        }

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

            // Open the modal to show the transaction status
            handleModal({
                action: "EDIT",
                transactionID: transactionID
            });
        } catch (error) {
            console.error(error);
        }
    }

    const post = async (message: string) => {
        if (!user?.loggedIn) {
            alert("Please connect wallet first.");
            return;
        }
        if (!userProfile) {
            alert("Please create a profile first.");
            return;
        }

        try {
            const transactionID = await fcl.mutate({
                cadence: `${PublishThought}`,
                args: (arg: any, t: any) => [
                    arg("", types.String), // header
                    arg(message, types.String), // body
                    arg([], types.Array(types.String)), // tags
                    arg("", types.String), // mediaHash
                    arg("text", types.String), // mediaType
                    arg(null, types.Optional(types.Address)), // quoteNFTOwner
                    arg(null, types.Optional(types.String)), // quoteNFTType
                    arg(null, types.Optional(types.UInt64)), // quoteNFTId
                    arg(null, types.Optional(types.Address)), // quoteCreator
                    arg(null, types.Optional(types.UInt64)), // quoteId
                ],
                proposer: fcl.currentUser,
                payer: fcl.currentUser,
                limit: 9999
            });

            // Open the modal to show the transaction status
            handleModal({
                action: "POST",
                transactionID: transactionID
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <ActionsContext.Provider value={{
            profileTxStatus,
            profileTxTracker,
            follow,
            unfollow,
            create,
            edit,
            post,
            setProfileTxStatus,
            setProfileTxTracker,
        }}>
            {children}
        </ActionsContext.Provider>
    );
};
