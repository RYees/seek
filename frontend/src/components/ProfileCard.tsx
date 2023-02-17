import styles from "@/styles/ProfileCard.module.css";
import Image from "next/image";
import { IProfileCard } from "@/types";
import { intlCompactNumFormat } from "@/hepers/functions";

export default function ProfileCard({
    address,
    name,
    handle,
    bio,
    followers,
    following,
    image,
}: IProfileCard) {

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <div className={styles.profileBg}>
                    <div className={styles.profileImg}>
                        <Image
                            src={image}
                            alt="avatar"
                            width={100}
                            height={100}
                        />
                    </div>
                </div>
                <div className={styles.profileInfo}>
                    <div className={styles.profileName}>{name}</div>
                    <div className={styles.profileDetails}>
                        <div className={styles.profileHandle}>{handle}</div>
                        <a className={styles.profileAddress}
                            href={`https://testnet.flowscan.org/address/${address}`}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Flowscan"
                        >{`${address.slice(0, 4)}...${address.slice(-4)}`}</a>
                    </div>
                    <div className={styles.profileBio}>{bio}</div>
                </div>
                <div className={styles.profileSocial}>
                    <div className={styles.profileFollowers}>
                        <div>{intlCompactNumFormat(followers)}</div>
                        <div>Followers</div>
                    </div>
                    <hr></hr>
                    <div className={styles.profileFollowing}>
                        <div>{intlCompactNumFormat(following)}</div>
                        <div>Following</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
