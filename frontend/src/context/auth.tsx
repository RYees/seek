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
} from "@/types";
import { getProfile } from "@/cadence/scripts/getProfile";

fcl.config({
    "flow.network": process.env.NEXT_PUBLIC_FLOW_NETWORK,
    "app.detail.title": process.env.NEXT_PUBLIC_APP_DETAIL_TITLE,
    "accessNode.api": process.env.NEXT_PUBLIC_ACCESS_NODE_API,
    "app.detail.icon": process.env.NEXT_PUBLIC_APP_DETAIL_ICON,
    "discovery.wallet": process.env.NEXT_PUBLIC_DISCOVERY_WALLET,
});

export const AuthContext = createContext<IAuthContext>({
    user: null,
    userProfile: null,
    trigger: "",
    login: async () => { },
    logout: async () => { },
    setTrigger: () => { },
});

AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
    const [trigger, setTrigger] = useState<string>("");

    // Event listener: user changes
    useEffect(() => {
        // Clear storage
        window.sessionStorage.clear();

        // Reset user
        setUser(null);
        setUserProfile(null);

        // Subscribe to user changes
        fcl.currentUser().subscribe(setUser);
    }, []);

    // Get user profile
    useEffect(() => {
        // Check clause
        if (!user || !user.loggedIn) return;

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

            } catch (err) {
                console.error(err);
            }
        }
        fetchProfile();
    }, [user]);


    // Update profile
    useEffect(() => {
        // Check clause
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
                setUserProfile({ ...res });

            } catch (err) {
                console.error(err);
            }
        }

        fetchProfile();
    }, [trigger, user]);

    const login = async () => {
        const res = await fcl.authenticate();
        setUser(res);
    };

    const logout = async () => {
        await fcl.unauthenticate();
        setUser(null);
        setUserProfile(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            userProfile,
            trigger,
            login,
            logout,
            setTrigger,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
