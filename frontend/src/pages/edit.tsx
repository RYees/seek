import Head from "next/head";
import styles from "@/styles/Edit.module.css";
import Navbar from "@/components/Navbar";
import EditProfileForm from "@/components/Forms/EditProfileForm";

export default function Edit() {
    return (
        <>
            <Head>
                <title>Edit profile</title>
            </Head>
            <main>
                <Navbar />
                <div className={styles.editLayout}>
                    <div className={styles.editLayoutTop}></div>
                    <div className={styles.editLayoutMid}>
                        <br></br>
                        <h2>Edit profile</h2>
                        <EditProfileForm />
                    </div>
                    <div className={styles.editLayoutBot}></div>
                </div>
            </main>
        </>
    );
}
