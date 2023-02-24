import styles from "@/styles/ClaimCard.module.css";
import ClaimBtn from "../Buttons/ClaimBtn";
import Sparkles from "../Sparkles";

export default function ClaimCard() {
    return (
        <div className={styles.claimCard}>
            <Sparkles>
                <span className={styles.claimCardTitle}>Claim your NFT</span>
            </Sparkles>
            <div className={styles.claimCardMessage}>Cherishing our early supporters! First 1.000 supporters can claim a Seek NFT that will offer perks in the future.</div>
            <ClaimBtn />
        </div>
    );
}
