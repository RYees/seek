import styles from "@/styles/FeaturedCard.module.css";
import Link from "next/link";
import Image from "next/image";
import { IProfileCard } from "@/types";
import FollowBtn from "../Buttons/FollowBtn";
import { parseURL } from "@/helpers/functions";

export default function FeaturedCard(
    { featured }: { featured: IProfileCard[] }
) {

    return (
        <div className={styles.featuredContainer}>
            <div className={styles.featuredCard}>
                <p>Featured</p>
                {
                    featured.length > 0 &&
                    featured.map((profile) => (
                        <div key={profile.address} className={styles.featuredCardProfile}>
                            <div className={styles.featuredCardProfileImg}>
                                {
                                    profile.avatar ?
                                        <Image
                                            src={parseURL(profile.avatar)}
                                            alt="avatar"
                                            width={40}
                                            height={40}
                                        />
                                        : <div className={styles.featuredCardImgPlaceholder}></div>
                                }
                            </div>
                            <div className={styles.featuredCardProfileInfo}>
                                <Link href={`/${profile.address}`}>
                                    <div className={styles.featuredCardProfileName}>{profile.name}</div>
                                    <div>{
                                        profile.findName ?
                                            `${String(profile.findName + ".find")}`
                                            : `${profile.address.slice(0, 6)}...${profile.address.slice(-6)}`
                                    }</div>
                                </Link>
                            </div>
                            <FollowBtn address={profile.address} />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
