import { useState, useEffect } from "react";
import styles from "@/styles/LoaderCard.module.css";
import { ILoaderCard } from "@/types";
import CheckIcon from "../Icons/CheckIcon";
import SpinnerIcon from "../Icons/SpinnerIcon";
import ErrorIcon from "../Icons/ErrorIcon";
// @ts-ignore
import * as fcl from "@onflow/fcl";

export default function LoaderCard(
    { status }: ILoaderCard
) {
    // const [status, setStatus] = useState<string>("INIT");

    // // Event listener for transaction updates
    // useEffect(() => {
    //     if (!transactionID) return;

    //     fcl.tx(transactionID).subscribe((res: any) => {
    //         console.log(res)
    //         if (res.statusCode === 0) {
    //             if (
    //                 res.statusString === "PENDING"
    //                 || res.statusString === ""
    //                 || res.statusString === "EXECUTED") {
    //                 setStatus("LOADING");
    //             } else {
    //                 setStatus("COMPLETED");
    //             }
    //         } else {
    //             setStatus("ERROR");
    //         }
    //     });
    // }, [transactionID]);

    return (
        <div className={styles.loaderCard}>
            {
                (status === "INIT") &&
                <div className={styles.loaderCardDefault}><CheckIcon /></div>
            }
            {
                (status === "LOADING") &&
                <div className={styles.loaderCardLoading}><SpinnerIcon /></div>
            }
            {
                (status === "COMPLETED") &&
                <div className={styles.loaderCardCompleted}><CheckIcon /></div>
            }
            {
                (status === "ERROR") &&
                <div className={styles.loaderCardError}><ErrorIcon /></div>
            }
        </div>
    );
}

