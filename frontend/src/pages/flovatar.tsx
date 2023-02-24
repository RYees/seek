import { useContext } from "react";
import styles from "@/styles/Flovatar.module.css";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import { DataContext } from "@/context/data";
import FlovatarCard from "@/components/Cards/FlovatarCard";

export default function Flovatar() {
    const { nfts } = useContext(DataContext);

    return (
        <>
            <Head>
                <title>Flovatar</title>
                <meta name="description" content="Seek. The social app you deserve." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Navbar />
                <br></br><br></br>
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
