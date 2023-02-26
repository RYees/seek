import Head from "next/head";
import styles from "@/styles/Create.module.css";
import Navbar from "@/components/Navbar";
import CreateProfileForm from "@/components/Forms/CreateProfileForm";

export default function Create() {
    return (
        <>
            <Head>
                <title>Create profile</title>
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
