import Head from "next/head";
import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";

export default function Account() {
    return (
        <>
            <Head>
                <title>Profile</title>
                <meta name="description" content="Seek. The social app you deserve." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Navbar />
                <Layout title="Posts" />
            </main>
        </>
    );
}
