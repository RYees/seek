import styles from "@/styles/FollowsCard.module.css";
import Link from "next/link";
import Image from "next/image";
import { IProfileCard } from "@/types";
import FollowBtn from "../Buttons/FollowBtn";
import { parseURL } from "@/helpers/functions";

export default function FollowsCard(
    { follows }: { follows: IProfileCard[] }
) {

    return (
        <div className={styles.followsContainer}>
            <div className={styles.followsCard}>
                {
                    follows.length > 0 &&
                    follows.map((profile) => (
                        <div key={profile.address}>
                            <div className={styles.followsCardProfile}>
                                <div className={styles.followsCardProfileImg}>
                                    {
                                        profile.avatar ?
                                            <Image
                                                src={parseURL(profile.avatar)}
                                                alt="avatar"
                                                width={40}
                                                height={40}
                                            />
                                            : <div className={styles.followsCardImgPlaceholder}></div>
                                    }
                                </div>
                                <div className={styles.followsCardProfileInfo}>
                                    <Link href={`/${profile.address}`}>
                                        <div className={styles.followsCardProfileName}>{profile.name}</div>
                                        <div>{
                                            profile.findName ?
                                                `${String(profile.findName + ".find")}`
                                                : `${profile.address.slice(0, 4)}...${profile.address.slice(-4)}`
                                        }</div>
                                    </Link>
                                </div>
                                <FollowBtn address={profile.address} />
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
