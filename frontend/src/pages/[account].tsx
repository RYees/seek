import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";
import { ILoadingCard } from "@/types";

export default function Account() {
    const router = useRouter();
    const { account } = router.query;
    const [state, setState] = useState<ILoadingCard>({
        loading: true,
        error: "",
    });

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
                <Layout
                    title="Posts"
                    account={account}
                    state={state}
                    setState={setState}
                />
            </main>
        </>
    );
}
