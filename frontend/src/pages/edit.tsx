import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@/styles/Edit.module.css";
import { useContext } from "react";
import { AuthContext } from "@/context/auth";
import Navbar from "@/components/Navbar";
import EditProfileForm from "@/components/Forms/EditProfileForm";

export default function Edit() {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    // Redirect to connect page if the user isn't logged in
    useEffect(() => {
        if (!user || !user?.loggedIn) {
            router.push("/connect");
        }
    }, [user]);

    return (
        <>
            <Head>
                <title>Edit profile</title>
                <meta name="description" content="Seek. The social app you deserve." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Navbar />
                <div className={styles.editLayout}>
                    <div className={styles.editLayoutTop}></div>
                    <div className={styles.editLayoutMid}>
                        <h2>Edit profile</h2>
                        <EditProfileForm />
                    </div>
                    <div className={styles.editLayoutBot}></div>
                </div>
            </main>
        </>
    );
}
