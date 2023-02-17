import styles from "@/styles/Logo.module.css";
import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/">
            <div className={styles.logo}>Seek</div>
        </Link>
    );
}
