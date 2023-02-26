import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/auth";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  // Redirect to connect page if the user isn't logged in
  useEffect(() => {
    if (!(user && user.loggedIn)) {
      router.push("/connect");
    }
  }, [user, router]);

  return (
    <>
      <Head>
        <title>Seek</title>
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
        <Layout title="Feed" />
      </main>
    </>
  );
}
