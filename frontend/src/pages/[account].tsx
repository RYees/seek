import Head from "next/head";
import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";

export default function Account() {
    return (
        <>
            <Head>
                <title>Profile</title>
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
                <Layout title="Posts" />
            </main>
        </>
    );
}
