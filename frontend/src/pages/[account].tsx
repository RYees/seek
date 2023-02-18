import Head from "next/head";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";

export default function Account() {
    const router = useRouter();
    const { account } = router.query;

    return (
        <>
            <Head>
                <title>Seek</title>
                <meta name="description" content="Social decentralized app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <Navbar />
                <Layout account={account} />
            </main>
        </>
    )
}
