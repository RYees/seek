import { useContext, useState } from "react";
import styles from "@/styles/Navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";
import ConnectBtn from "./Buttons/ConnectBtn";
import CreateBtn from "./Buttons/CreateBtn";
import UserIcon from "./Icons/UserIcon";
import LogoutIcon from "./Icons/LogoutIcon";
import { parseURL } from "@/helpers/functions";
import { AuthContext } from "@/context/auth";

export default function Navbar() {
    const { user, userProfile, logout } = useContext(AuthContext);
    const [showPopover, setPopover] = useState<boolean>(false);

    const handleMouseEnter = () => {
        setPopover(true);
    }

    const handleMouseLeave = () => {
        setPopover(false);
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarWrapper}>
                <Logo />
                <div></div>
                {
                    user?.loggedIn
                        ? <div className={styles.navbarProfile}>
                            {
                                userProfile
                                    ? <div
                                        className={styles.navbarImg}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        {
                                            userProfile?.avatar ?
                                                <Image
                                                    src={parseURL(userProfile?.avatar)}
                                                    alt="avatar"
                                                    width={40}
                                                    height={40}
                                                />
                                                : <div className={styles.navbarImgPlaceholder}></div>
                                        }
                                        {
                                            showPopover &&
                                            <div className={styles.navbarPopover}>
                                                <div className={styles.navbarPopoverOption}>
                                                    <Link href={`/${user.addr}`}>
                                                        <UserIcon />
                                                        <span>Profile</span>
                                                    </Link>
                                                </div>
                                                <div className={styles.navbarPopoverOption}>
                                                    <button onClick={() => logout()}>
                                                        <LogoutIcon />
                                                        <span>Logout</span>
                                                    </button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    : <CreateBtn />
                            }
                        </div>
                        : <ConnectBtn />
                }
            </div>
        </nav>
    )
}
