import styles from "@/styles/RecommendsCard.module.css";
import Link from "next/link";
import Image from "next/image";
import { IProfileCard } from "@/types";
import FollowBtn from "../Buttons/FollowBtn";
import { parseURL } from "@/helpers/functions";

export default function RecommendsCard(
    { recommended }: { recommended: IProfileCard[] }
) {

    return (
        <div className={styles.recommendsContainer}>
            <div className={styles.recommendsCard}>
                <p>Who to follow</p>
                {
                    recommended.length > 0 &&
                    recommended.slice(0, 5).map((profile) => (
                        <div key={profile.address} className={styles.recommendsCardProfile}>
                            <div className={styles.recommendsCardProfileImg}>
                                {
                                    profile.avatar ?
                                        <Image
                                            src={parseURL(profile.avatar)}
                                            alt="avatar"
                                            width={40}
                                            height={40}
                                        />
                                        : <div className={styles.recommendsCardImgPlaceholder}></div>
                                }
                            </div>
                            <div className={styles.recommendsCardProfileInfo}>
                                <div className={styles.recommendsCardProfileName}>{profile.name}</div>
                                <Link href={`/${profile.address}`}>
                                    <div>{`${profile.address.slice(0, 6)}...${profile.address.slice(-6)}`}</div>
                                </Link>
                            </div>
                            <FollowBtn />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
