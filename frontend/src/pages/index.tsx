import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { useContext } from "react";
import { AuthContext } from "@/context/auth";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/Cards/ProfileCard";
import SearchBar from "@/components/SearchBar";
import { IProfileCard } from "@/types";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const authContext = useContext(AuthContext);

  // TODO: Fetch profiles from backend
  const dummyData = [
    {
      id: 1,
      address: "0xd9f8bdff66e451de",
      name: "Snowdot",
      description: "Frontend developer with a dream",
      followers: [],
      following: [],
      avatar: "https://picsum.photos/200/300",
    },
    {
      id: 2,
      address: "0xdec5369b36230285",
      name: "Samer",
      description: "Backend developer & devops",
      followers: [null, null],
      following: [null, null],
      avatar: "https://picsum.photos/200/301",
    },
  ];

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
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
            dummyData.length > 0 &&
            dummyData.map((profile: IProfileCard) => (
              <ProfileCard
                key={profile.id}
                {...profile}
              />
            ))
          }
        </div>
      </main>
    </>
  )
}
