import { useState, useEffect } from "react";
import styles from "@/styles/Layout.module.css";
import ProfileCard from "./Cards/ProfileCard";
import NFTsCard from "./Cards/NTFsCard";
import RecommendsCard from "./Cards/RecommendsCard";
import PostCard from "./Cards/PostCard";
import { INFTCard, IProfileCard, INftList } from "@/types";
import { orderNFTs, parseURL } from "@/helpers/functions";
// @ts-ignore
import * as fcl from "@onflow/fcl";
// @ts-ignore
import * as types from "@onflow/types";
import { getProfile } from "@/cadence/scripts/getProfile";
import { getNFTCatalogIDs } from "@/cadence/scripts/getNFTCatalogIDs";
import { getNFTDetailsNFTCatalog } from "@/cadence/scripts/getNFTDetailsNFTCatalog";

export default function Layout(
    { account }: { account: string | undefined | string[] }
) {
    // TODO: get recommends from backend
    const [recommendList, setRecommendList] = useState<string[]>(["0xdec5369b36230285", "0x886f3aeaf848c535", "0x92ba5cba77fc1e87", "0x3f09321b132509d1", "0xd9f8bdff66e451de"]);

    // State variables
    const [profile, setProfile] = useState<IProfileCard | null>(null);
    const [recommended, setRecommended] = useState<IProfileCard[]>([]);
    const [nftList, setNFTList] = useState<INftList[]>([]);
    const [nfts, setNfts] = useState<INFTCard[]>([]);

    // Get profile of the current user
    useEffect(() => {
        setProfile(null);

        if (!account) return;

        async function fetchProfile() {
            try {
                const res = await fcl.query({
                    cadence: `${getProfile}`,
                    args: (arg: any, t: any) => [
                        arg(account, types.Address),
                    ],
                });
                setProfile(res);
            } catch (err) {
                console.error(err);
            }
        }
        fetchProfile();
    }, [account]);

    // Get profiles of recommended users
    useEffect(() => {
        setRecommended([]);

        if (recommendList.length === 0) return;

        async function getProfiles() {
            const promises: any[] = [];
            recommendList.forEach(async (address) => {
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
                setRecommended([...res]);
            } catch (error) {
                console.error(error);
            }
        }

        getProfiles();
    }, [recommendList]);

    // Get NFT list for the account
    useEffect(() => {
        setNFTList([]);

        if (!account) return;

        async function fetchNftList() {
            try {
                const res = await fcl.query({
                    cadence: `${getNFTCatalogIDs}`,
                    args: (arg: any, t: any) => [
                        arg(account, types.String),
                        arg([], types.Array(types.String)),
                    ],
                });
                console.log(res);
                const nfts = orderNFTs(res, account as string);
                setNFTList(nfts);
            } catch (err) {
                console.error(err);
            }
        }
        fetchNftList();
    }, [account]);

    // Get details for all NFTs in the list
    useEffect(() => {
        setNfts([]);

        if (nftList.length === 0) return;

        async function fetchNftDetails() {
            const promises: any[] = [];
            nftList.forEach(async (nft) => {
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

            try {
                const res = (await Promise.all(promises))
                    .filter((nft) => nft !== null)
                    .map((nft) => {
                        return {
                            id: nft.nftDetail.uuid,
                            name: nft.nftDetail.name,
                            image: parseURL(nft.nftDetail.thumbnail),
                        }
                    });
                setNfts([...res]);
            } catch (error) {
                console.error(error);
            }
        }
        fetchNftDetails();
    }, [nftList]);

    return (
        <div className={styles.layout}>
            <div className={styles.layoutWrapper}>
                <div className={styles.layoutTop}>
                    {
                        profile &&
                        <ProfileCard {...profile} />
                    }
                    <NFTsCard nfts={nfts} />
                </div>
                <div className={styles.layoutMid}>
                    <PostCard />
                </div>
                <div className={styles.layoutBot}>
                    {
                        recommended.length > 0 &&
                        <RecommendsCard recommended={recommended} />
                    }
                </div>
            </div>
        </div>
    )
}
