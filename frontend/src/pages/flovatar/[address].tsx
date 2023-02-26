import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/Flovatar.module.css";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import FlovatarCard from "@/components/Cards/FlovatarCard";
import LoadingCard from "@/components/Cards/LoadingCard";
import { DataContext } from "@/context/data";

export default function Flovatar() {
    const router = useRouter();
    const {
        state,
        profile,
        nfts,
        setAddress,
    } = useContext(DataContext);
    const { address } = router.query;

    useEffect(() => {
        if (address) {
            setAddress(address as string);
        }
    }, [address, setAddress]);

    return (
        <>
            <Head>
                <title>Flovatar</title>
            </Head>
            <main>
                <Navbar />
                <br></br>
                {
                    (state.loading || state.error)
                        ? <LoadingCard
                            loading={state.loading}
                            error={state.error}
                        />
                        : (<div>
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
                        </div>)
                }
            </main>
        </>
    );
}
