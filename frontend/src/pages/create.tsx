import Head from "next/head";
import styles from "@/styles/Create.module.css";
import Navbar from "@/components/Navbar";
import CreateProfileForm from "@/components/Forms/CreateProfileForm";

export default function Create() {
    return (
        <>
            <Head>
                <title>Create profile</title>
                <meta name="language" content="en" />
                <meta name="theme-color" content="#24272C" />
                <meta charSet="utf-8" />
                <meta name="keywords" content="social flow blockchain" />
                <meta name="description" content="Seek is a decentralized social media platform that enables users to own their social identity and social capital." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Navbar />
                <div className={styles.createLayout}>
                    <div className={styles.createLayoutTop}></div>
                    <div className={styles.createLayoutMid}>
                        <br></br>
                        <h2>Create profile</h2>
                        <CreateProfileForm />
                    </div>
                    <div className={styles.createLayoutBot}></div>
                </div>
            </main>
        </>
    );
}
