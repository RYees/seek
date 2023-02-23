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
import { reverseLookup } from "@/cadence/scripts/reverseLookup";
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
    hasProfile: false,
    userProfile: null,
    trigger: "",
    login: async () => { },
    logout: async () => { },
    setTrigger: () => { },
});

AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [hasProfile, setHasProfile] = useState<boolean | null>(null);
    const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
    const [trigger, setTrigger] = useState<string>("");

    // Event listener: user changes
    useEffect(() => {
        fcl.currentUser().subscribe(setUser);
    }, []);

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
                setUserProfile({ ...res });

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
    };

    return (
        <AuthContext.Provider value={{
            user,
            hasProfile,
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
