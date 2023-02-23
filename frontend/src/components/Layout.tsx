import { useEffect, useContext, useMemo } from "react";
import styles from "@/styles/Layout.module.css";
import { useRouter } from "next/router";
import ProfileCard from "./Cards/ProfileCard";
import NFTsCard from "./Cards/NTFsCard";
import PostsCard from "./Cards/PostsCard";
import RecommendsCard from "./Cards/RecommendsCard";
import PostMessageCard from "./Cards/PostMessageCard";
import LoadingCard from "./Cards/LoadingCard";
import FeaturedCard from "./Cards/FeaturedCard";
import { AuthContext } from "@/context/auth";
import { DataContext } from "@/context/data";

export default function Layout({ title }: { title: string }) {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const {
        state,
        profile,
        nfts,
        posts,
        recommended,
        featured,
        setAddress,
        setPath
    } = useContext(DataContext);
    const { account } = router.query;
    const address = useMemo(() => {
        let res;
        if (router.pathname === "/") {
            res = user?.addr;
        } else {
            res = account;
        }
        return res;
    }, [user, account]);
    const isProfile = useMemo(() => {
        return Boolean(user?.addr === address);
    }, [user, account]);

    useEffect(() => {
        if (address) {
            setAddress(address as string);
        }
    }, [address]);

    useEffect(() => {
        if (title === "Feed") {
            setPath("/");
        } else {
            setPath(`/${address}`);
        }
    }, [title]);

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
