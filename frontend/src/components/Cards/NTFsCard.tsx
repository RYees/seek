import styles from "@/styles/NFTsCard.module.css";
import Link from "next/link";
import Image from "next/image";
import { INFTCard } from "@/types";

export default function NFTsCard(
    { nfts }: { nfts: INFTCard[] }
) {

    return (
        <div className={styles.nftsContainer}>
            <div className={styles.nftsCard}>
                <div className={styles.nftsCardHead}>
                    <p>NFTs</p>
                    <Link href="/nfts">
                        <div>See all</div>
                    </Link>
                </div>
                <div className={styles.nftsCardBody}>
                    {
                        nfts.length === 0 &&
                        <p>User has no NFTs.</p>
                    }
                    {
                        nfts.length > 0 &&
                        nfts.slice(0, 9).map((nft) => (
                            <div key={nft.id} className={styles.nftsCardImg}>
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
        </div>
    )
}
