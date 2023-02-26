import styles from "@/styles/PostBtn.module.css";
import { useContext } from "react";
import { ActionsContext } from "@/context/actions";

export default function PostBtn(
    {
        message,
        setMessage
    }: {
        message: string,
        setMessage: (message: string) => void
    }
) {
    const { post } = useContext(ActionsContext);

    const handlePost = () => {
        if (!message) {
            alert("Please enter a message.");
            return;
        }
        post(message);
        setMessage("");
    }

    return (
        <button
            className={styles.postBtn}
            onClick={handlePost}
        >
            POST
        </button>
    );
}
