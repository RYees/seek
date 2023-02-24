import {
    ReactNode,
    createContext,
    useEffect,
    useState,
    useContext,
    useMemo,
} from "react";
// @ts-ignore
import * as fcl from "@onflow/fcl";
// @ts-ignore
import * as types from "@onflow/types";
import {
    IDataContext,
    IProfileCard,
    INFTCard,
    IPostCard,
    ILoadingCard,
} from "@/types";
import { parseURL } from "@/helpers/functions";
import { getProfile } from "@/cadence/scripts/getProfile";
import { getFlovatars } from "@/cadence/scripts/getFlovatars";
import { AuthContext } from "./auth";
import { getProfileFeed, getProfilePosts, getProfileRecommended } from "@/api";
import { isAbortError } from "@/helpers/functions";
import { getTotalSupply } from "@/cadence/scripts/getTotalSupply";
import { getMintedAddresses } from "@/cadence/scripts/getMintedAddresses";

export const DataContext = createContext<IDataContext>({
    state: {
        loading: true,
        error: "",
    },
    profile: null,
    nfts: [],
    posts: [],
    recommended: [],
    featured: [],
    address: null,
    path: null,
    hasClaimed: false,
    profileHasClaimed: false,
    totalSupply: 0,
    setAddress: () => { },
    setPath: () => { },
});

DataContext.displayName = "DataContext";

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const { user, trigger } = useContext(AuthContext);

    // Featured accounts [hadcoded data]
    const featuredList = useMemo(() => {
        return [
            "0xdec5369b36230285",
            "0xf4c99941cd3ae3d5",
            "0x886f3aeaf848c535",
            "0x92ba5cba77fc1e87",
            "0xd9f8bdff66e451de",
            "0x2a0eccae942667be"
        ];
    }, []);

    // State variables
    const [profile, setProfile] = useState<IProfileCard | null>(null);
    const [nfts, setNfts] = useState<INFTCard[]>([]);
    const [postList, setPostList] = useState<IPostCard[]>([]);
    const [posts, setPosts] = useState<IPostCard[]>([]);
    const [recommended, setRecommended] = useState<IProfileCard[]>([]);
    const [featured, setFeatured] = useState<IProfileCard[]>([]);
    const [state, setState] = useState<ILoadingCard>({
        loading: true,
        error: "",
    });
    const [address, setAddress] = useState<string | null>(null);
    const [path, setPath] = useState<string | null>(null);
    const [hasClaimed, setHasClaimed] = useState<boolean>(false);
    const [profileHasClaimed, setProfileHasClaimed] = useState<boolean>(false);
    const [totalSupply, setTotalSupply] = useState<number>(0);

    // ~~~ Cadence scripts ~~~
    // Get profile and nfts of the account
    useEffect(() => {
        // Reset
        setState({ loading: true, error: "" });
        setProfile(null);
        setNfts([]);
        setProfileHasClaimed(false);

        // Check clause
        if (!address) return;

        async function fetchProfile() {
            try {
                // Get profile
                const res = await fcl.query({
                    cadence: `${getProfile}`,
                    args: (arg: any, t: any) => [
                        arg(address, types.Address),
                    ],
                });

                // Check if user has claimed the SeekEarlySupporters NFT
                const claimed = await fcl.query({
                    cadence: `${getMintedAddresses}`,
                    args: (arg: any, t: any) => [
                        arg(address, types.Address),
                    ],
                });

                // Get NFT list
                const nftList = await fcl.query({
                    cadence: `${getFlovatars}`,
                    args: (arg: any, t: any) => [
                        arg(address, types.Address),
                    ],
                });

                const nftDetails = nftList
                    .filter((nft: INFTCard) => nft !== null)
                    .map((nft: INFTCard) => {
                        return {
                            ...nft,
                            id: String(nft.id),
                            image: `https://flovatar.com/api/image/${nft.id}`,
                            address: address,
                        }
                    });

                // Update state variables
                setProfile(res);
                setNfts([...nftDetails]);
                setProfileHasClaimed(claimed);
                setState({
                    loading: false,
                    error: ""
                });
            } catch (err) {
                console.error(err);
                setProfile(null);
                setNfts([]);
                setProfileHasClaimed(false);
                setState({
                    loading: false,
                    error: "Error: Something went wrong. Please try again."
                });
            }
        }

        fetchProfile();
    }, [address, trigger]);

    // ~~~ API calls ~~~
    // Get profile feed/posts
    useEffect(() => {
        // Reset
        setPostList([]);

        // Check clause
        if (!profile) return;
        if (!path) return;

        let query: any;

        if (path === "/") {
            query = getProfileFeed(profile.address as string);
        } else {
            query = getProfilePosts(profile.address as string);
        }

        query
            .then((res: any) => {
                // Update state variables
                setPostList(res);
            })
            .catch((err: any) => {
                if (isAbortError(err)) {
                    console.log("The user aborted the request.");
                } else {
                    console.error(err.message);
                }
            });

        return () => {
            query.cancel();
        }
    }, [profile, path]);

    // Get details for all posts in the list
    useEffect(() => {
        // Reset
        setPosts([]);

        // Check clause
        if (!profile) return;
        if (postList.length === 0) return;

        async function fetchPostDetails() {
            const promises: any[] = [];
            postList.forEach(async (post) => {
                promises.push(fcl.query({
                    cadence: `${getProfile}`,
                    args: (arg: any, t: any) => [
                        arg(post.creator, types.Address),
                    ],
                }));
            });

            try {
                const res = (await Promise.all(promises))
                    .filter((post) => post !== null);

                const postsDetailed: IPostCard[] = [];
                postList.forEach((post) => {
                    const creator = res.find((creator) => creator.address === post.creator);
                    const postDetailed = {
                        ...post,
                        creation_date: post.creation_date,
                        name: creator?.name,
                        avatar: parseURL(creator?.avatar),
                        address: creator?.address,
                    }
                    postsDetailed.push(postDetailed);
                });

                // Update state variables
                setPosts([...postsDetailed]);
            } catch (error) {
                console.error(error);
            }
        }
        fetchPostDetails();
    }, [profile, postList]);

    // Get recommended profiles
    useEffect(() => {
        // Reset
        setRecommended([]);

        // Check clause
        if (!user || !user.loggedIn) return;

        // Get recommended profiles
        let query: any;
        query = getProfileRecommended(user.addr as string);
        query
            .then(async (res: any) => {
                const recommendList = res;

                // Check clause
                if (recommendList.length === 0) return;

                // Get profiles of recommended users
                const promises: any[] = [];
                recommendList.forEach(async (profile: IProfileCard) => {
                    promises.push(fcl.query({
                        cadence: `${getProfile}`,
                        args: (arg: any, t: any) => [
                            arg(profile.address, types.Address),
                        ],
                    }));
                });

                try {
                    const res = (await Promise.all(promises))
                        .filter((profile) => profile !== null)
                        .map((profile) => {
                            const reason = recommendList.find((recommended: IProfileCard) => profile.address === recommended.address).reason;
                            return {
                                ...profile,
                                reason: reason
                            }
                        });
                    setRecommended([...res]);
                } catch (error) {
                    throw error;
                }
            })
            .catch((err: any) => {
                if (isAbortError(err)) {
                    console.log("The user aborted the request.");
                } else {
                    console.error(err.message);
                }
            });

        return () => {
            query.cancel();
        }
    }, [user]);

    // Get profiles of featured users
    useEffect(() => {
        // Reset
        setFeatured([]);

        async function getProfiles() {
            const promises: any[] = [];
            featuredList.forEach(async (address) => {
                promises.push(fcl.query({
                    cadence: `${getProfile}`,
                    args: (arg: any, t: any) => [
                        arg(address, types.Address),
                    ],
                }));
            });

            try {
                const res = (await Promise.all(promises))
                    .filter((profile) => profile !== null);
                setFeatured([...res]);
            } catch (error) {
                console.error(error);
            }
        }

        getProfiles();
    }, [featuredList]);

    // Check if user has claimed the SeekEarlySupporters NFT
    useEffect(() => {
        // Reset
        setHasClaimed(false);

        // Check clause
        if (!user || !user.addr) return;

        async function checkHasClaimed() {
            if (!user?.addr) return;

            try {
                // Check if user has claimed the SeekEarlySupporters NFT
                const claimed = await fcl.query({
                    cadence: `${getMintedAddresses}`,
                    args: (arg: any, t: any) => [
                        arg(user.addr, types.Address),
                    ],
                });

                if (claimed) {
                    setHasClaimed(true);
                    return;
                }
            } catch (error) {
                console.error(error);
                setHasClaimed(false);
            }
        }

        checkHasClaimed();
    }, [user, trigger]);

    // Check if user has claimed the SeekEarlySupporters NFT
    useEffect(() => {
        // Reset
        setTotalSupply(1000);

        async function getSupply() {
            if (!user?.addr) return;

            try {
                // Check total number of NFTs owned by user
                const totalSupply = await fcl.query({
                    cadence: `${getTotalSupply}`,
                });

                // Update state variables
                setTotalSupply(totalSupply);
            } catch (error) {
                console.error(error);
                setTotalSupply(1000);
            }
        }

        getSupply();
    }, [user?.addr]);

    return (
        <DataContext.Provider value={{
            state,
            profile,
            nfts,
            posts,
            recommended,
            featured,
            address,
            path,
            hasClaimed,
            profileHasClaimed,
            totalSupply,
            setAddress,
            setPath,
        }}>
            {children}
        </DataContext.Provider>
    );
};
