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
                    recommended.slice(0, 3).map((profile) => (
                        <div key={profile.address}>
                            <div className={styles.recommendsCardProfile}>
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
                                    <Link href={`/${profile.address}`}>
                                        <div className={styles.recommendsCardProfileName}>{profile.name}</div>
                                        <div>{
                                            profile.findName ?
                                                `${String(profile.findName + ".find")}`
                                                : `${profile.address.slice(0, 4)}...${profile.address.slice(-4)}`
                                        }</div>
                                    </Link>
                                </div>
                                <FollowBtn address={profile.address} />
                            </div>
                            <div className={styles.recommendsCardReason}>{profile.reason}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
