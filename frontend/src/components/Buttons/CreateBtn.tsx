import styles from "@/styles/CreateBtn.module.css";
import Link from "next/link";

export default function CreateBtn() {
    return (
        <Link href="/create" className={styles.createBtn}>
            <span>Create Profile</span>
        </Link>
    );
}
