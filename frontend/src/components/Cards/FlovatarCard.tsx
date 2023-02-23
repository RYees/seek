import styles from "@/styles/FlovatarCard.module.css";
import Link from "next/link";
import Image from "next/image";
import { IFlovatarCard } from "@/types";
import FlovatarIcon from "../Icons/FlovatarIcon";

export default function FlovatarCard(
    { id, image, address }: IFlovatarCard
) {

    return (
        <div className={styles.fflovatarContainer}>
            <Link
                href={`https://flovatar.com/flovatars/${id}/${address}`}
                target="_blank"
            >
                <div className={styles.flovatarCard}>
                    <div className={styles.flovatarCardImg}>
                        {
                            image ?
                                <Image
                                    src={image}
                                    alt="flovatar"
                                    width={300}
                                    height={300}
                                />
                                : <div className={styles.flovatarCardPlaceholder}>
                                    <FlovatarIcon />
                                </div>
                        }
                    </div>
                    <div className={styles.flovatarCardId}>#{id}</div>
                </div>
            </Link>
        </div>
    );
}
