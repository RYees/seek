import {
    useState,
    useContext,
    useEffect,
    ChangeEvent,
} from "react";
import styles from "@/styles/CreateProfileForm.module.css";
import ProfileCard from "../Cards/ProfileCard";
import LoaderCard from "@/components/Cards/LoaderCard";
import { IProfileCard } from "@/types";
import { AuthContext } from "@/context/auth";

export default function CreateProfileForm() {
    const {
        userProfile,
        profileTxStatus,
        create,
        edit
    } = useContext(AuthContext);
    const [newProfile, setNewProfile] = useState<IProfileCard>({
        name: "",
        description: "",
        avatar: "",
        followers: [],
        following: [],
        address: "0x000000000000",
        findName: ""
    });

    useEffect(() => {
        if (!userProfile) return;
        setNewProfile({ ...userProfile });
    }, [userProfile]);

    const handleOnInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewProfile({
            ...newProfile,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div className={styles.createProfileForm}>
            <div className={styles.createProfileFormSteps}>
                <div className={styles.createProfileFormStep}>
                    <div>
                        <h3>Step 1: Register your name</h3>
                        <p>Let the world know your name.</p>
                        <br></br>
                        <div>
                            <input
                                name="name"
                                value={userProfile?.name ? "" : newProfile.name}
                                onChange={handleOnInputChange}
                                disabled={Boolean(userProfile?.name)}
                                placeholder="Enter name..."
                                autoComplete="off"
                                autoCorrect="off"
                            />
                            <button
                                className={styles.createProfileBtn}
                                disabled={
                                    Boolean(userProfile?.name) ||
                                    profileTxStatus.create.status === "LOADING" ||
                                    profileTxStatus.create.status === "COMPLETED"
                                }
                                onClick={() => create(newProfile.name)}
                            >Register Name</button>
                        </div>
                    </div>
                    <LoaderCard {...profileTxStatus.create} />
                </div>
                <div className={styles.createProfileFormStep}>
                    <div>
                        <h3>Step 2: Customize Profile</h3>
                        <p>Let the world know how awesome your are.</p>
                        <br></br><br></br>
                        <div>
                            <div className={styles.createProfileFormLabel}>Avatar URL</div>
                            <input
                                name="avatar"
                                value={newProfile.avatar}
                                onChange={handleOnInputChange}
                                placeholder="Avatar URL..."
                                autoComplete="off"
                                autoCorrect="off"
                            />
                            <br></br><br></br>
                            <div className={styles.createProfileFormLabel}>Bio</div>
                            <input
                                name="description"
                                value={newProfile.description}
                                onChange={handleOnInputChange}
                                placeholder="Bio..."
                                autoComplete="off"
                                autoCorrect="off"
                            />
                            <br></br><br></br>
                            <button
                                className={styles.createProfileBtn}
                                disabled={
                                    !Boolean(userProfile?.name) ||
                                    profileTxStatus.edit.status === "LOADING"
                                }
                                onClick={() => edit(newProfile.name, newProfile.description, newProfile.avatar)}
                            >Customize Profile</button>
                        </div>
                    </div>
                    <LoaderCard {...profileTxStatus.edit} />
                </div>
            </div>
            <div className={styles.createProfileFormPreview}>
                <h3>Preview</h3>
                <br></br>
                <ProfileCard
                    {...newProfile}
                    name={newProfile.name ? newProfile.name : "Your name"}
                    description={newProfile.description ? newProfile.description : "Get creative with your bio!"}
                />
            </div>
        </div>
    );
}
