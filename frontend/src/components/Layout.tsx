import { useState, useEffect, useContext } from "react";
import styles from "@/styles/Layout.module.css";
import { useRouter } from "next/router";
import ProfileCard from "./Cards/ProfileCard";
import NFTsCard from "./Cards/NTFsCard";
import PostsCard from "./Cards/PostsCard";
import RecommendsCard from "./Cards/RecommendsCard";
import PostMessageCard from "./Cards/PostMessageCard";
import LoadingCard from "./Cards/LoadingCard";
import FeaturedCard from "./Cards/FeaturedCard";
import {
    INFTCard,
    IPostCard,
    IProfileCard,
    ILoadingCard,
    INftList
} from "@/types";
import { orderNFTs, parseURL, isAbortError } from "@/helpers/functions";
import { getProfileFeed, getProfilePosts, getProfileRecommended } from "@/api";
// @ts-ignore
import * as fcl from "@onflow/fcl";
// @ts-ignore
import * as types from "@onflow/types";
import { getProfile } from "@/cadence/scripts/getProfile";
import { getNFTCatalogIDs } from "@/cadence/scripts/getNFTCatalogIDs";
import { getNFTDetailsNFTCatalog } from "@/cadence/scripts/getNFTDetailsNFTCatalog";
import { AuthContext } from "@/context/auth";

export default function Layout(
    {
        title,
        account,
        state,
        setState
    }: {
        title: string;
        account: string | undefined | string[],
        state: { loading: boolean, error: string },
        setState: (state: ILoadingCard) => void
    }
) {
    const { user, trigger } = useContext(AuthContext);
    const isProfile = Boolean(user?.addr === account);
    const router = useRouter();

    // Featured accounts [hadcoded data]
    const [featuredList, setFeatureList] = useState<string[]>([
        "0xdec5369b36230285",
        "0xf4c99941cd3ae3d5",
        "0x886f3aeaf848c535",
        "0x92ba5cba77fc1e87",
        "0xd9f8bdff66e451de"
    ]);

    // State variables
    const [profile, setProfile] = useState<IProfileCard | null>(null);
    const [recommendList, setRecommendList] = useState<any[]>([]);
    const [recommended, setRecommended] = useState<IProfileCard[]>([]);
    const [featured, setFeatured] = useState<IProfileCard[]>([]);
    const [nfts, setNfts] = useState<INFTCard[]>([]);
    const [postList, setPostList] = useState<IPostCard[]>([]);
    const [posts, setPosts] = useState<IPostCard[]>([]);

    // ~~~ Cadence scripts ~~~
    // Get profile and nfts of the account
    useEffect(() => {
        setState({ loading: true, error: "" });
        setProfile(null);
        setNfts([]);

        if (!account) return;

        async function fetchProfile() {
            try {
                // Get profile
                const res = await fcl.query({
                    cadence: `${getProfile}`,
                    args: (arg: any, t: any) => [
                        arg(account, types.Address),
                    ],
                });

                // Get NFT list
                const nftListRes = await fcl.query({
                    cadence: `${getNFTCatalogIDs}`,
                    args: (arg: any, t: any) => [
                        arg(account, types.String),
                        arg([], types.Array(types.String)),
                    ],
                });
                const nftList = orderNFTs(nftListRes, account as string);

                // Get NFT details
                const promises: any[] = [];
                nftList.forEach(async (nft: INftList) => {
                    promises.push(fcl.query({
                        cadence: `${getNFTDetailsNFTCatalog}`,
                        args: (arg: any, t: any) => [
                            arg(nft.user, types.String),
                            arg(nft.project, types.String),
                            arg(nft.id, types.UInt64),
                            arg(nft.views, types.Array(types.String)),
                        ],
                    }));
                });

                const nftDetails = (await Promise.all(promises))
                    .filter((nft) => nft !== null)
                    .map((nft) => {
                        return {
                            id: nft.nftDetail.uuid,
                            name: nft.nftDetail.name,
                            image: parseURL(nft.nftDetail.thumbnail),
                        }
                    });

                // Update state variables
                setProfile(res);
                setNfts([...nftDetails]);
                setState({
                    loading: false,
                    error: ""
                });
            } catch (err) {
                console.error(err);
                setState({
                    loading: false,
                    error: "Error: Something went wrong. Please try again."
                });
            }
        }
        fetchProfile();
    }, [account, trigger]);

    // Get profiles of recommended users
    useEffect(() => {
        setRecommended([]);

        if (!profile) return;
        if (recommendList.length === 0) return;

        async function getProfiles() {
            const promises: any[] = [];
            recommendList.forEach(async (profile) => {
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
                        const reason = recommendList.find((recommended) => profile.address === recommended.address).reason;
                        return {
                            ...profile,
                            reason: reason
                        }
                    });
                setRecommended([...res]);
            } catch (error) {
                console.error(error);
            }
        }

        getProfiles();
    }, [profile, recommendList]);

    // Get profiles of featured users
    useEffect(() => {
        setFeatured([]);

        if (!user) return;
        if (featuredList.length === 0) return;

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
    }, [user, featuredList]);

    // Get details for all posts in the list
    useEffect(() => {
        setPosts([]);

        if (postList.length === 0) return;
        if (!profile) return;

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

    // ~~~ API calls ~~~
    // Get profile feed/posts
    useEffect(() => {
        // Reset
        setPostList([]);

        if (!account) return;
        if (!profile) return;

        let query: any;

        if (router.pathname === "/") {
            query = getProfileFeed(account as string);
        } else {
            query = getProfilePosts(account as string);
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
    }, [account, profile, router.pathname]);

    // Get recommended profiles
    useEffect(() => {
        // Reset
        setRecommendList([]);

        if (!account) return;
        if (!user) return;

        let query: any;

        query = getProfileRecommended(user.addr as string);

        query
            .then((res: any) => {
                // Update state variables
                setRecommendList(res);
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
    }, [account, user]);

    return (
        <div className={styles.layout}>
            <div className={styles.layoutWrapper}>
                <div className={styles.layoutTop}>
                    {
                        profile &&
                        <>
                            <ProfileCard
                                {...profile}
                                isProfile={isProfile}
                            />
                            <NFTsCard nfts={nfts} />
                        </>
                    }
                </div>
                <div className={styles.layoutMid}>
                    {
                        (state.loading || state.error)
                            ? <LoadingCard
                                loading={state.loading}
                                error={state.error}
                            />
                            : (
                                profile
                                    ? <div>
                                        {router.pathname === "/" && <PostMessageCard />}
                                        <PostsCard
                                            title={title}
                                            posts={posts}
                                        />
                                    </div>
                                    : <div className={styles.layoutMessage}>
                                        <p>User doesn&apos;t have a profile yet.</p>
                                    </div>
                            )
                    }
                </div>
                <div className={styles.layoutBot}>
                    {
                        profile &&
                        featured.length > 0 &&
                        <FeaturedCard featured={featured} />
                    }
                    {
                        profile &&
                        recommended.length > 0 &&
                        <RecommendsCard recommended={recommended} />
                    }
                </div>
            </div>
        </div>
    );
}
