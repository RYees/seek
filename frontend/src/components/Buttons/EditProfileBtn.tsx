import styles from "@/styles/EditProfileBtn.module.css";
import Link from "next/link";

export default function EditProfileBtn() {
    return (
        <Link href="/edit" className={styles.editProfileBtn}>
            <span>Edit Profile</span>
        </Link>
    );
}
