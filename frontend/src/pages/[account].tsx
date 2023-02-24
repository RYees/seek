import Head from "next/head";
import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";

export default function Account() {
    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            <main>
                <Navbar />
                <Layout title="Posts" />
            </main>
        </>
    );
}
