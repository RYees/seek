import { useState, useEffect } from "react";
import styles from "@/styles/ProfileCard.module.css";
import Link from "next/link";
import Image from "next/image";
import { IProfileCard } from "@/types";
import { intlCompactNumFormat, parseURL } from "@/helpers/functions";
import FollowBtn from "../Buttons/FollowBtn";
import EditProfileBtn from "../Buttons/EditProfileBtn";
import FollowsCard from "./FollowsCard";
import { getProfile } from "@/cadence/scripts/getProfile";
import BorderIcon from "../Icons/BorderIcon";
import FlovatarIcon from "../Icons/FlovatarIcon";
import FindIcon from "../Icons/FindIcon";
// @ts-ignore
import * as fcl from "@onflow/fcl";
// @ts-ignore
import * as types from "@onflow/types";

export default function ProfileCard({
    address,
    name,
    description,
    followers,
    following,
    avatar,
    findName,
    isProfile,
    hideFollow,
    profileHasClaimed,
    hasFlovatar,
    hideBadges,
}: IProfileCard) {
    const [showModal, setShowModal] = useState<string | null>(null);
    const [follows, setFollows] = useState<IProfileCard[]>([]);

    // Get profiles of followers/following
    useEffect(() => {
        // Reset
        setFollows([]);

        let list: string[] = [];
        if (!showModal) return;
        if (showModal === "followers") {
            list = followers.map((profile) => profile.follower);
        } else if (showModal === "following") {
            list = following.map((profile) => profile.following);
        }
        if (list.length === 0) return;

        async function getProfiles() {
            const promises: any[] = [];
            list.forEach(async (address) => {
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
                setFollows([...res]);
            } catch (error) {
                console.error(error);
            }
        }

        getProfiles();
    }, [showModal, followers, following]);

    const handleOpenModal = (e: any) => {
        setShowModal(e.currentTarget.value);
    }

    const handleCloseModal = (e: any) => {
        if (e.target.className === styles.profileCardModal) {
            setShowModal(null);
        }
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <div className={styles.profileBg}>
                    <div className={styles.profileImg}>
                        {
                            avatar ?
                                <Image
                                    src={parseURL(avatar)}
                                    alt="avatar"
                                    width={100}
                                    height={100}
                                />
                                : <div className={styles.profileImgPlaceholder}></div>
                        }
                    </div>
                    {
                        !hideBadges &&
                        <div className={styles.profileImgBadgesCard}>
                            {
                                !hideFollow &&
                                <div className={styles.profileImgBadges}>
                                    {
                                        profileHasClaimed &&
                                        <span
                                            className={styles.tooltip}
                                            data-text="Seek early supporter NFT owner."
                                        >
                                            <BorderIcon />
                                        </span>
                                    }
                                    {
                                        Boolean(findName) &&
                                        <div className={styles.profileCardFindBadge}>
                                            <span
                                                className={styles.tooltip}
                                                data-text=".find name owner."
                                            >
                                                <FindIcon />
                                            </span>
                                        </div>
                                    }
                                    {
                                        hasFlovatar &&
                                        <div className={styles.profileCardFlovatarBadge}>
                                            <span
                                                className={styles.tooltip}
                                                data-text="Flovatar NFT owner."
                                            >
                                                <FlovatarIcon />
                                            </span>
                                        </div>
                                    }
                                </div>
                            }

                        </div>
                    }
                </div>
                <div className={styles.profileInfo}>
                    <div className={styles.profileFollow}>
                        <div className={styles.profileDetails}>
                            <Link href={`/${address}`}>
                                <div>{name}</div>
                                <div>{findName ? `${String(findName + ".find")}` : `${address.slice(0, 4)}...${address.slice(-4)}`}</div>
                            </Link>
                        </div>
                        {
                            !hideFollow &&
                            (
                                isProfile
                                    ? <EditProfileBtn />
                                    : <FollowBtn address={address} />
                            )
                        }
                    </div>
                    <div className={styles.profileBio}>{description}</div>
                    {
                        hasFlovatar &&
                        <Link href={`/flovatar/${address}`}>
                            <div className={styles.profileFlovatarLink}>
                                <span>View Flovatars</span>
                            </div>
                        </Link>
                    }
                </div>
                <div className={styles.profileSocial}>
                    <button
                        className={styles.profileFollowers}
                        onClick={handleOpenModal}
                        value="followers"
                    >
                        <div>{intlCompactNumFormat(followers.length)}</div>
                        <div>Followers</div>
                    </button>
                    <hr></hr>
                    <button
                        className={styles.profileFollowing}
                        onClick={handleOpenModal}
                        value="following"
                    >
                        <div>{intlCompactNumFormat(following.length)}</div>
                        <div>Following</div>
                    </button>
                </div>
            </div>
            {
                (showModal && follows.length > 0) &&
                <div
                    className={styles.profileCardModal}
                    onClick={handleCloseModal}
                >
                    <div className={styles.profileCardModalWrapper}>
                        <div className={styles.profileCardModalTitle}>
                            <div>{showModal === "followers" ? "Followers" : "Following"}</div>
                        </div>
                        <FollowsCard follows={follows} />
                    </div>
                </div>
            }
        </div>
    );
}
