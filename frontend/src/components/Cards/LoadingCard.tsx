import styles from "@/styles/LoadingCard.module.css";
import { ILoadingCard } from "@/types";
import SpinnerIcon from "../Icons/SpinnerIcon";

export default function LoadingCard(
    { loading, error }: ILoadingCard
) {
    return (
        <div className={styles.loadingCard}>
            {
                !error
                    ? <div className={styles.loadingCardLoading}>
                        <SpinnerIcon />
                        <div>One moment please...</div>
                    </div>
                    : <div className={styles.loadingCardError}>{error}</div>
            }
        </div>
    );
}

