import styles from "@/styles/ProfileCard.module.css";
import Link from "next/link";
import Image from "next/image";
import { IProfileCard } from "@/types";
import { intlCompactNumFormat, parseURL } from "@/helpers/functions";

export default function ProfileCard({
    address,
    name,
    description,
    followers,
    following,
    avatar,
}: IProfileCard) {

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
                </div>
                <div className={styles.profileInfo}>
                    <div className={styles.profileName}>{name}</div>
                    <div className={styles.profileDetails}>
                        <Link href={`/${address}`}>
                            <div>{address}</div>
                        </Link>
                    </div>
                    <div className={styles.profileBio}>{description}</div>
                </div>
                <div className={styles.profileSocial}>
                    <div className={styles.profileFollowers}>
                        <div>{intlCompactNumFormat(followers.length)}</div>
                        <div>Followers</div>
                    </div>
                    <hr></hr>
                    <div className={styles.profileFollowing}>
                        <div>{intlCompactNumFormat(following.length)}</div>
                        <div>Following</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
