import { useContext } from "react";
import styles from "@/styles/NFTsCard.module.css";
import Link from "next/link";
import Image from "next/image";
import { INFTCard } from "@/types";
import { DataContext } from "@/context/data";

export default function NFTsCard(
    { nfts }: { nfts: INFTCard[] }
) {
    const { address } = useContext(DataContext);

    return (
        <div className={styles.nftsContainer}>
            {
                nfts.length > 0 &&
                <div className={styles.nftsCard}>
                    <div className={styles.nftsCardHead}>
                        <p>Flovatars</p>
                        {
                            address &&
                            <Link href={`/flovatar/${address}`}>
                                <div>View all</div>
                            </Link>
                        }
                    </div>
                    <div className={styles.nftsCardBody}>
                        {
                            nfts.slice(0, 9).map((nft: INFTCard) => (
                                <div
                                    key={nft.id}
                                    className={styles.nftsCardImg}
                                >
                                    <Image
                                        src={nft.image}
                                        alt="nft"
                                        width={60}
                                        height={60}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            }
        </div>
    );
}
