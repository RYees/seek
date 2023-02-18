import {
    ReactNode,
    createContext,
    useEffect,
    useState,
} from "react";
import { IAuthContext, IUser } from "@/types";
import { reverseLookup } from "@/cadence/scripts/reverseLookup";
// @ts-ignore
import * as fcl from "@onflow/fcl";
// @ts-ignore
import * as types from "@onflow/types";

fcl.config({
    "flow.network": process.env.NEXT_PUBLIC_FLOW_NETWORK,
    "app.detail.title": process.env.NEXT_PUBLIC_APP_DETAIL_TITLE,
    "accessNode.api": process.env.NEXT_PUBLIC_ACCESS_NODE_API,
    "app.detail.icon": process.env.NEXT_PUBLIC_APP_DETAIL_ICON,
    "discovery.wallet": process.env.NEXT_PUBLIC_DISCOVERY_WALLET,
});

export const AuthContext = createContext<IAuthContext>({
    user: null,
    login: async () => { },
    logout: async () => { },
});

AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [hasProfile, setHasProfile] = useState<boolean>(false);

    useEffect(() => {
        // TODO: update here
        // console.log(user);
        // fcl.currentUser().subscribe(setUser);
    }, []);

    useEffect(() => {
        async function checkHasProfile() {
            if (!user?.addr) return;

            try {
                const res = await fcl.query({
                    cadence: `${reverseLookup}`,
                    args: (arg: any, t: any) => [
                        arg(user.addr, types.Address),
                    ],
                });

                setHasProfile(Boolean(res));
            } catch (err) {
                setHasProfile(false);
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
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
