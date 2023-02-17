import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { IAuthContext } from "@/types";
// @ts-ignore
import * as fcl from "@onflow/fcl";
// @ts-ignore
import * as types from "@onflow/types";

fcl.config({
    "flow.network": process.env.NEXT_PUBLIC_FLOW_NETWORK,
    "app.detail.title": process.env.NEXT_PUBLIC_APP_TITLE,
    "accessNode.api": process.env.NEXT_PUBLIC_ACCESS_NODE_API,
    "app.detail.icon": process.env.NEXT_PUBLIC_APP_DETAIL_ICON,
    "discovery.wallet": process.env.NEXT_PUBLIC_DISCOVERY_WALLET,
});

export const AuthContext = createContext<IAuthContext>({
    account: "",
    login: async () => { },
    logout: async () => { },
});

AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [account, setAccount] = useState<string>("");

    useEffect(() => {
        console.log(fcl)
        fcl.currentUser().subscribe(setAccount);
    }, []);

    const login = async () => {
        const user = await fcl.logIn();
        console.log(user)
        const account = await fcl.currentUser().snapshot();
        setAccount(account?.addr ?? "");
    };

    const logout = async () => {
        await fcl.unauthenticate();
        setAccount("");
    };

    return (
        <AuthContext.Provider value={{
            account,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
