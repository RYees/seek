import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@/styles/Connect.module.css";
import { useContext } from "react";
import { AuthContext } from "@/context/auth";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/Cards/ProfileCard";
import LoadingCard from "@/components/Cards/LoadingCard";
import { IProfileCard } from "@/types";
import { getProfile } from "@/cadence/scripts/getProfile";
// @ts-ignore
import * as fcl from "@onflow/fcl";
// @ts-ignore
import * as types from "@onflow/types";

export default function Connect() {
    const { user, login } = useContext(AuthContext);
    const router = useRouter();
    const [state, setState] = useState({
        loading: true,
        error: "",
    });

    // Featured users [Hardcoded data]
    const list = useMemo(() => {
        return [
            "0x886f3aeaf848c535",
            "0x92ba5cba77fc1e87",
            "0x2a0eccae942667be",
            "0x2022205b2cade6b0",
        ];
    }, []);
    const [profiles, setProfiles] = useState<IProfileCard[]>([]);

    // Redirect to home if user is logged in
    useEffect(() => {
        if (user && user?.loggedIn) {
            router.push("/");
        }
    }, [user, router]);

    // Get profiles to display users
    useEffect(() => {
        // Reset
        setProfiles([]);
        setState({ loading: true, error: "" });

        async function getProfiles() {
            const promises: any[] = [];
            list.forEach(async (address) => {
                promises.push(fcl.query({
                    cadence: `${getProfile}`,
                    args: (arg: any, t: any) => [
                        arg(address, types.Address),
                    ],
                }));
            });

            try {
                const res = (await Promise.all(promises))
                    .filter((profile) => profile !== null);

                // Update state variables
                setProfiles([...res]);
                setState({
                    loading: false,
                    error: ""
                });
            } catch (err) {
                console.error(err);
                setState({
                    loading: false,
                    error: "Error: Something went wrong. Please try again."
                });
            }
        }

        getProfiles();
    }, [list]);

    return (
        <>
            <Head>
                <title>Connect</title>
                <meta name="language" content="en" />
                <meta name="theme-color" content="#24272C" />
                <meta charSet="utf-8" />
                <meta name="keywords" content="social flow blockchain" />
                <meta name="description" content="Seek is a decentralized social media platform that enables users to own their social identity and social capital." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <Navbar />
                <div className={styles.hero}>
                    <div className={styles.heroWrapper}>
                        <h1>The social media app that you deserve.</h1>
                        <br></br>
                        <p>Join your Flow friends now!</p>
                        <br></br>
                        <button
                            className={styles.heroConnectBtn}
                            onClick={() => login()}
                        >
                            <span>Connect Wallet</span>
                        </button>
                    </div>
                </div>
                <br></br><br></br><br></br>
                <h2>Our beautiful community</h2>
                <br></br>
                <div className={styles.profiles}>
                    {
                        (state.loading || state.error)
                            ? <LoadingCard
                                loading={state.loading}
                                error={state.error}
                            />
                            : (
                                profiles.length > 0 &&
                                profiles.map((profile: IProfileCard) => (
                                    <ProfileCard
                                        key={profile.address}
                                        {...profile}
                                        hideBadges={true}
                                    />
                                ))
                            )
                    }
                </div>
            </main>
        </>
    );
}
