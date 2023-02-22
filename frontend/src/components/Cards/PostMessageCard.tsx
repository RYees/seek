import { useContext, useState, ChangeEvent } from "react";
import styles from "@/styles/PostMessageCard.module.css";
import Image from "next/image";
import PostBtn from "../Buttons/PostBtn";
import { AuthContext } from "@/context/auth";
import { parseURL } from "@/helpers/functions";

export default function PostMessageCard() {
    const { user, userProfile } = useContext(AuthContext);
    const [message, setMessage] = useState<string>("");

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }

    return (
        <>
            {
                user?.loggedIn && userProfile &&
                <div className={styles.postMessageCard}>
                    <div className={styles.postMessageCardImg}>
                        {
                            userProfile?.avatar ?
                                <Image
                                    src={parseURL(userProfile?.avatar)}
                                    alt="avatar"
                                    width={40}
                                    height={40}
                                />
                                : <div className={styles.postMessageCardPlaceholder}></div>
                        }
                    </div>
                    <div className={styles.postMessageCardInput}>
                        <input
                            type="text"
                            placeholder="What's happening?"
                            value={message}
                            onChange={handleOnChange}
                            autoComplete="off"
                            autoCorrect="off"
                        />
                    </div>
                    <PostBtn message={message} />
                </div>
            }
        </>
    );
}
