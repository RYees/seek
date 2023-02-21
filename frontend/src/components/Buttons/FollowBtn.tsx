import { useContext } from "react";
import styles from "@/styles/FollowBtn.module.css";
import { AuthContext } from "@/context/auth";

export default function FollowBtn(
    { address }: { address: string }
) {
    const { userProfile, follow, unfollow } = useContext(AuthContext);

    const isFollowing = userProfile?.following
        .map((profile) => profile.following)
        .includes(address);

    const handleFollow = () => {
        follow(address);
    }

    const handleUnfollow = () => {
        unfollow(address);
    }

    return (
        <button
            className={styles.followBtn}
            onClick={isFollowing ? handleUnfollow : handleFollow}
        >
            {isFollowing ? "Unfollow" : "Follow"}
        </button>
    );
}
