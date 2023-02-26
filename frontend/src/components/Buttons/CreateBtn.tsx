import styles from "@/styles/CreateBtn.module.css";
import Link from "next/link";
import NewUserIcon from "../Icons/NewUserIcon";

export default function CreateBtn() {
    return (
        <Link href="/create" className={styles.createBtn}>
            <span>Create Profile</span>
            <NewUserIcon />
        </Link>
    );
}
