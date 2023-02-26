import { useContext } from "react";
import Link from "next/link";
import styles from "@/styles/Flovatar.module.css";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import { DataContext } from "@/context/data";
import FlovatarCard from "@/components/Cards/FlovatarCard";

export default function Flovatar() {
    const { profile, nfts } = useContext(DataContext);

    return (
        <>
            <Head>
                <title>Flovatar</title>
            </Head>
            <main>
                <Navbar />
                <br></br><br></br>
                {
                    profile?.address &&
                    <Link href={`/${profile?.address}`}>
                        <h2 className={styles.flovatarAddressLink}>
                            {
                                profile?.name
                                    ? profile?.name
                                    : profile?.address
                            }&apos;s
                        </h2>
                    </Link>
                }
                <h2>Flovatar collection</h2>
                <br></br><br></br>
                <button
                    className={styles.flovatarStatsBtn}
                    disabled={true}
                >
                    VIEW STATS (coming soon)
                </button>
                <br></br><br></br>
                <div className={styles.flovatars}>
                    {nfts.length > 0 &&
                        nfts.map((nft) => (
                            <FlovatarCard
                                key={nft.id}
                                {...nft}
                            />
                        ))}
                    {
                        nfts.length === 0 &&
                        <p>No flovatars found.</p>
                    }
                </div>
            </main>
        </>
    );
}
