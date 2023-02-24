import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@/styles/Create.module.css";
import Navbar from "@/components/Navbar";
import CreateProfileForm from "@/components/Forms/CreateProfileForm";
import { AuthContext } from "@/context/auth";

export default function Create() {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    // Redirect to home if user is logged in and has a profile
    useEffect(() => {
        if (user && user?.loggedIn) {
            router.push("/connect");
        }
    }, [user, router]);

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
