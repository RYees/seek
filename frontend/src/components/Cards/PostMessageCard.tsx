import { useContext, useState, ChangeEvent } from "react";
import styles from "@/styles/PostMessageCard.module.css";
import Image from "next/image";
import PostBtn from "../Buttons/PostBtn";
import { AuthContext } from "@/context/auth";
import { parseURL } from "@/helpers/functions";
import PhotoIcon from "../Icons/PhotoIcon";
import CloseIcon from "../Icons/CloseIcon";
import GifIcon from "../Icons/GifIcon";
import { fileToBase64 } from "@/helpers/functions";

export default function PostMessageCard() {
    const { user, userProfile } = useContext(AuthContext);
    const [postShowModal, setPostShowModal] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [imageString, setImageString] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    }

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        // Reset image
        setImageFile(null);
        setImageString("");

        // Check if file exists
        if (!e.target.files) return;

        try {
            // Check if file is above 5MB
            if (e.target.files[0].size > 5000000) {
                throw Error("File is is above 5MB!");
            };

            const res = await fileToBase64(e.target.files[0]) as string;

            // Update state
            setImageFile(e.target.files[0]);
            setImageString(res);
        } catch (error) {
            alert(error);
            console.error(error);
        }
    }

    const handleOpenModal = () => {
        setPostShowModal(true);
    }

    const handleCloseModal = (e: any) => {
        if (e.target.className === styles.postModal) {
            closeModal();
        }
    }

    const handleRemoveImage = () => {
        setImageFile(null);
        setImageString("");
    }

    const closeModal = () => {
        setPostShowModal(false);
        setMessage("");
        setImageFile(null);
        setImageString("");
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
                    <div
                        className={styles.postMessageCardInput}
                        onClick={handleOpenModal}
                    > What&apos;s happening?</div>
                </div>
            }
            {
                postShowModal &&
                <div
                    className={styles.postModal}
                    onClick={handleCloseModal}
                >
                    <div className={styles.postModalWrapper}>
                        <h3>Create post</h3>
                        <hr></hr>
                        <div className={styles.postModalInputArea}>
                            <textarea
                                placeholder="What's happening?"
                                value={message}
                                onChange={handleOnChange}
                                autoComplete="off"
                                autoCorrect="off"
                            />
                            {
                                imageString &&
                                <div className={styles.postModalImgPreview}>
                                    <Image
                                        src={imageString}
                                        alt="uploaded image"
                                        width={300}
                                        height={300}
                                    />
                                    <div
                                        className={styles.postModalImgClose}
                                        onClick={handleRemoveImage}
                                    ><CloseIcon /></div>
                                </div>
                            }
                        </div>
                        <hr></hr>
                        <div className={styles.postModalExtra}>
                            <div className={styles.postModalExtraIcons}>
                                <div>
                                    <label htmlFor="image-upload-photo">
                                        <PhotoIcon />
                                    </label>
                                    <input
                                        id="image-upload-photo"
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="image-upload-gif">
                                        <GifIcon />
                                    </label>
                                    <input
                                        id="image-upload-gif"
                                        type="file"
                                        accept="image/gif"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            </div>
                            <PostBtn
                                file={imageFile ? imageFile : null}
                                message={message}
                                closeModal={closeModal}
                            />
                        </div>
                    </div>
                </div>
            }
        </>
    );
}
