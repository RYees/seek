import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/context/auth";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";
import { ILoadingCard } from "@/types";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [state, setState] = useState<ILoadingCard>({
    loading: true,
    error: "",
  });

  // Redirect to connect page if the user isn't logged in
  useEffect(() => {
    if (!user || !user?.loggedIn) {
      router.push("/connect");
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Seek. The social app you deserve." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        <Layout
          title="Feed"
          account={user?.addr}
          state={state}
          setState={setState}
        />
      </main>
    </>
  );
}
