import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useContext } from "react";
import { AuthContext } from "@/context/auth";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/Cards/ProfileCard";
import SearchBar from "@/components/SearchBar";
import { IProfileCard } from "@/types";
import { getProfile } from "@/cadence/scripts/getProfile";
// @ts-ignore
import * as fcl from "@onflow/fcl";
// @ts-ignore
import * as types from "@onflow/types";

export default function Home() {
  const authContext = useContext(AuthContext);

  // TODO: get list from backend
  const [list, setList] = useState<string[]>([
    "0xdec5369b36230285",
    "0x886f3aeaf848c535",
    "0x92ba5cba77fc1e87",
    "0x3f09321b132509d1",
    "0xd9f8bdff66e451de"
  ]);
  const [profiles, setProfiles] = useState<IProfileCard[]>([]);

  // Get profiles to display users
  useEffect(() => {
    setProfiles([]);

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
        setProfiles([...res]);
      } catch (error) {
        console.error(error);
      }
    }

    getProfiles();
  }, [list]);

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Seek. The social app you deserve." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.hero}>
          <div className={styles.heroWrapper}>
            <h1>Explore the social app that you deserve</h1>
            <br></br>
            <p>Join the decentralized society now</p>
            <br></br>
            <SearchBar />
          </div>
        </div>
        <br></br><br></br><br></br>
        <h2>Our beautiful community</h2>
        <br></br>
        <div className={styles.profiles}>
          {
            profiles.length > 0 &&
            profiles.map((profile: IProfileCard) => (
              <ProfileCard
                key={profile.address}
                {...profile}
              />
            ))
          }
        </div>
      </main>
    </>
  )
}
