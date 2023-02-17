import styles from "@/styles/Navbar.module.css";
import Logo from "./Logo";
import ConnectBtn from "./ConnectBtn";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <Logo />
            <div>Link</div>
            <ConnectBtn />
        </nav>
    )
}
