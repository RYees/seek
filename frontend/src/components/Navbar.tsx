import { useContext } from "react";
import styles from "@/styles/Navbar.module.css";
import Logo from "./Logo";
import ConnectBtn from "./Buttons/ConnectBtn";
import { AuthContext } from "@/context/auth";

export default function Navbar() {
    const { user } = useContext(AuthContext);

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarWrapper}>
                <Logo />
                <div></div>
                {
                    user?.loggedIn
                        ? <div>{user.addr}</div>
                        : <ConnectBtn />
                }
            </div>
        </nav>
    )
}
