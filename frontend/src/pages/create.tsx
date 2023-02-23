import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@/styles/Create.module.css";
import { useContext } from "react";
import { AuthContext } from "@/context/auth";
import Navbar from "@/components/Navbar";
import CreateProfileForm from "@/components/Forms/CreateProfileForm";

export default function Create() {
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
                <title>Create profile</title>
                <meta name="description" content="Seek. The social app you deserve." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Navbar />
                <div className={styles.createLayout}>
                    <div className={styles.createLayoutTop}></div>
                    <div className={styles.createLayoutMid}>
                        <br></br><br></br>
                        <h2>Create profile</h2>
                        <CreateProfileForm />
                    </div>
                    <div className={styles.createLayoutBot}></div>
                </div>
            </main>
        </>
    );
}
