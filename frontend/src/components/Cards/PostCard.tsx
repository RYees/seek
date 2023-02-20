import { useContext } from "react";
import styles from "@/styles/PostCard.module.css";
import Image from "next/image";
import PostBtn from "../Buttons/PostBtn";
import { AuthContext } from "@/context/auth";
import { parseURL } from "@/helpers/functions";

export default function PostCard() {
    const { user, userProfile } = useContext(AuthContext);

    return (
        <>
            {
                user?.loggedIn && userProfile &&
                <div className={styles.postCard}>
                    <div className={styles.postCardImg}>
                        {
                            userProfile?.avatar ?
                                <Image
                                    src={parseURL(userProfile?.avatar)}
                                    alt="avatar"
                                    width={40}
                                    height={40}
                                />
                                : <div className={styles.postCardPlaceholder}></div>
                        }
                    </div>
                    <div className={styles.postCardInput}>
                        <input type="text" placeholder="What's happening?" />
                    </div>
                    <PostBtn />
                </div>
            }
        </>
    );
}
