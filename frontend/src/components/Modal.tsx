import styles from "@/styles/Modal.module.css";
import { useContext, useEffect, useState } from "react";
import { ModalContext } from "@/context/modal";
import { AuthContext } from "@/context/auth";
import LoaderCard from "./Cards/LoaderCard";
// @ts-ignore
import * as fcl from "@onflow/fcl";

const network = process.env.NEXT_PUBLIC_FLOW_NETWORK || "testnet";

export default function Modal() {
    const { modal, modalType, handleModal } = useContext(ModalContext);
    const { setTrigger } = useContext(AuthContext);
    const [txStatus, setTxStatus] = useState({
        status: "LOADING",
        error: ""
    });
    const flowScanUrl = (network === "testnet")
        ? "https://testnet.flowscan.org"
        : "https://flowscan.org";

    // Event listener for the transaction
    useEffect(() => {
        // Check clause
        if (!modalType) return;
        if (!modalType.transactionID) return;

        fcl.tx(modalType.transactionID).subscribe((res: any) => {
            if (res.statusCode === 0) {
                if (
                    res.statusString === "PENDING"
                    || res.statusString === ""
                    || res.statusString === "EXECUTED") {
                    setTxStatus({
                        ...txStatus,
                        status: "LOADING",
                    });
                } else {
                    setTxStatus({
                        ...txStatus,
                        status: "COMPLETED",
                    });

                    // Trigger a profile update
                    setTimeout(() => {
                        setTrigger(String(Date.now()));
                        handleModal(null);
                    }, 1500);
                }
            } else {
                setTxStatus({
                    ...txStatus,
                    status: "ERROR",
                });

                // Trigger a profile update
                setTimeout(() => {
                    setTrigger(String(Date.now()));
                    handleModal(null);
                }, 1500);

                // TODO: alert user with the error
                console.error(res.errorMessage);
            }
        });
    }, [modalType]);

    return (
        <>
            {
                modal &&
                <div className={styles.modal}>
                    <div className={styles.modalWrapper}>
                        <div className={styles.modalContent}>
                            <LoaderCard
                                status={txStatus.status}
                                error={txStatus.error}
                            />
                            <div className={styles.modalContentMessage}>{`Tracking your transaction for the ${modalType?.action}: `}
                                <a
                                    href={`${flowScanUrl}/transaction/${modalType?.transactionID}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >{modalType?.transactionID}</a>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}
