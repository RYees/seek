import styles from "@/styles/Modal.module.css";
import { useContext, useEffect, useState } from "react";
import { ModalContext } from "@/context/modal";
import { AuthContext } from "@/context/auth";
import LoaderCard from "./Cards/LoaderCard";
// @ts-ignore
import * as fcl from "@onflow/fcl";

export default function Modal() {
    const { modal, modalType, handleModal } = useContext(ModalContext);
    const { setTrigger } = useContext(AuthContext);
    const [txStatus, setTxStatus] = useState({
        status: "LOADING",
        error: ""
    });

    // Event listener for the transaction
    useEffect(() => {
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

                // TODO: alert user with the error
                console.log(res.errorMessage);
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
                            <div className={styles.modalContentMessage}>{`Tracking your transaction for the ${modalType?.action}: ${modalType?.transactionID}.`}</div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}
