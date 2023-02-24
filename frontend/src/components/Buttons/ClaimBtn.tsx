import { useContext } from "react";
import styles from "@/styles/ClaimBtn.module.css";
import { ActionsContext } from "@/context/actions";

export default function ClaimBtn() {
    const { claim } = useContext(ActionsContext);

    return (
        <button
            className={styles.claimBtn}
            onClick={() => claim()}
        >
            <span>Claim NFT</span>
        </button>
    );
}
