import styles from "@/styles/PostBtn.module.css";
import { useContext } from "react";
import { ActionsContext } from "@/context/actions";

export default function PostBtn({ message }: { message: string }) {
    const { post } = useContext(ActionsContext);

    const handlePost = () => {
        if (!message) {
            alert("Please enter a message.");
            return;
        }
        post(message);
    }

    return (
        <button
            className={styles.postBtn}
            onClick={handlePost}
        >
            Post
        </button>
    );
}
