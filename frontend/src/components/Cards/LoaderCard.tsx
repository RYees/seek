import styles from "@/styles/LoaderCard.module.css";
import { ILoaderCard } from "@/types";
import CheckIcon from "../Icons/CheckIcon";
import SpinnerIcon from "../Icons/SpinnerIcon";
import ErrorIcon from "../Icons/ErrorIcon";

export default function LoaderCard(
    { status }: ILoaderCard
) {
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

