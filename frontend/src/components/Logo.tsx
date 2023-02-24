import styles from "@/styles/Logo.module.css";
import Link from "next/link";
import BorderIcon from "./Icons/BorderIcon";

export default function Logo() {
    return (
        <Link href="/">
            <div className={styles.logo}>
                <BorderIcon />
                <span>seek</span>
            </div>
        </Link>
    );
}
