import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@/styles/Connect.module.css";
import { useContext } from "react";
import { AuthContext } from "@/context/auth";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/Cards/ProfileCard";
import SearchBar from "@/components/SearchBar";
import LoadingCard from "@/components/Cards/LoadingCard";
import ConnectBtn from "@/components/Buttons/ConnectBtn";
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
    const [list, setList] = useState<string[]>([
        "0xdec5369b36230285",
        "0xf4c99941cd3ae3d5",
        "0x886f3aeaf848c535",
        "0x92ba5cba77fc1e87",
    ]);
    const [profiles, setProfiles] = useState<IProfileCard[]>([]);

    // Redirect to home if user is logged in and has a profile
    useEffect(() => {
        if (user && user?.loggedIn) {
            router.push("/");
        }
    }, [user]);

    // Get profiles to display users
    useEffect(() => {
        // Reset
        setProfiles([]);
        setState({ loading: true, error: "" });

        if (list.length === 0) return;

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
                <meta name="description" content="Seek. The social app you deserve." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <Navbar />
                <div className={styles.hero}>
                    <div className={styles.heroWrapper}>
                        <h1>Seek. The social app that you deserve.</h1>
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
                                    />
                                ))
                            )
                    }
                </div>
            </main>
        </>
    );
}
