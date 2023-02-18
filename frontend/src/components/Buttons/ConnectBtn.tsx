import { useContext } from "react";
import styles from "@/styles/ConnectBtn.module.css";
import WalletIcon from "../Icons/WalletIcon";
import { AuthContext } from "@/context/auth";

export default function ConnectBtn() {
    const { login } = useContext(AuthContext);

    return (
        <button
            className={styles.connectBtn}
            onClick={() => login()}
        >
            <WalletIcon />
            <span>Connect Wallet</span>
        </button>
    );
}
