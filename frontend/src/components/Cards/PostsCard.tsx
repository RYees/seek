import styles from "@/styles/PostsCard.module.css";
import Image from "next/image";
import Link from "next/link";
import { IPostCard } from "@/types";
import { parseURL, timeSince } from "@/helpers/functions";

export default function PostsCard({ posts, title }: { posts: IPostCard[], title: string }) {
    return (
        <div className={styles.postsContainer}>
            <div className={styles.postCardTitle}>
                <div>{title}</div>
            </div>
            {
                posts.length > 0 ?
                    posts.map((post: IPostCard) => (
                        <div key={post.id} className={styles.postCard}>
                            <div className={styles.postCardHead}>
                                <div className={styles.postCardImg}>
                                    {
                                        post?.avatar ?
                                            <Image
                                                src={parseURL(post?.avatar)}
                                                alt="avatar"
                                                width={40}
                                                height={40}
                                            />
                                            : <div className={styles.postCardPlaceholder}></div>
                                    }
                                </div>
                                <div className={styles.postCardInfo}>
                                    <Link href={`/${post?.address}`}>
                                        <div className={styles.postCardName}>{post?.name}</div>
                                        <div>{`${post.address.slice(0, 4)}...${post.address.slice(-4)}`}</div>
                                    </Link>
                                </div>
                                <div className={styles.postCardTime}>{timeSince(new Date(post.creation_date).getTime())}</div>
                            </div>
                            <div className={styles.postCardBody}>
                                <div className={styles.postCardText}>{post?.message}</div>
                            </div>
                        </div>
                    ))
                    : <div className={styles.postCardEmpty}>No posts to show.</div>
            }
        </div>
    );
}
