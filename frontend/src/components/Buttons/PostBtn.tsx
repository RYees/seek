import styles from "@/styles/PostBtn.module.css";
import { useContext } from "react";
import { ActionsContext } from "@/context/actions";
import { pinFileToIPFS } from "@/helpers/functions";

export default function PostBtn(
    {
        file,
        message,
        closeModal,
    }: {
        file: File | null,
        message: string,
        closeModal: () => void,
    }
) {
    const { post } = useContext(ActionsContext);

    const handlePost = async () => {
        try {
            if (!(message || file)) {
                throw Error("Both message and file are empty.");
            }

            let ipfsHash = "";
            if (file) {
                ipfsHash = await pinFileToIPFS(file);
            }

            post(message, file, ipfsHash);
            closeModal();
        } catch (error) {
            alert(error);
            console.error(error);
        }
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
