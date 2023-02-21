import styles from "@/styles/NFTsCard.module.css";
import Link from "next/link";
import Image from "next/image";
import { INFTCard } from "@/types";

export default function NFTsCard(
    { nfts }: { nfts: INFTCard[] }
) {

    return (
        <div className={styles.nftsContainer}>
            {
                nfts.length > 0 &&
                <div className={styles.nftsCard}>
                    <div className={styles.nftsCardHead}>
                        <p>NFTs</p>
                        <Link href="/nfts">
                            <div>See all</div>
                        </Link>
                    </div>
                    <div className={styles.nftsCardBody}>
                        {
                            nfts.map((nft: INFTCard) => (
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
            }
        </div>
    );
}
