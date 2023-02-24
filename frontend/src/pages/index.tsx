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
        <title>Home</title>
      </Head>
      <main>
        <Navbar />
        <Layout title="Feed" />
      </main>
    </>
  );
}
