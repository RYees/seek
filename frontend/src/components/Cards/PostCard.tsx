import styles from "@/styles/PostCard.module.css";
import Image from "next/image";
import PostBtn from "../Buttons/PostBtn";

export default function PostCard() {
    return (
        <div className={styles.postCard}>
            <div className={styles.postCardImg}>
                <Image
                    src="https://picsum.photos/200/300"
                    alt="avatar"
                    width={40}
                    height={40}
                />
            </div>
            <div className={styles.postCardInput}>
                <input type="text" placeholder="What's happening?" />
            </div>
            <PostBtn />
        </div>
    )
}
