import { useContext, useState, useEffect } from "react";
import styles from "@/styles/Navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";
import ConnectBtn from "./Buttons/ConnectBtn";
import LogoutIcon from "./Icons/LogoutIcon";
import SettingsIcon from "./Icons/SettingsIcon";
import { parseURL } from "@/helpers/functions";
import { AuthContext } from "@/context/auth";
import { useRouter } from "next/router";
import SearchBar from "./SearchBar";
import NewUserIcon from "./Icons/NewUserIcon";

export default function Navbar() {
    const router = useRouter();
    const pathname = router.pathname;
    const { account } = router.query;
    const activeLink = account ? `/${account}` : pathname;
    const { user, userProfile, logout } = useContext(AuthContext);
    const [showPopover, setShowPopover] = useState<boolean>(false);

    useEffect(() => {
        // Reset popover state
        setShowPopover(false);
    }, [router]);

    const handleMouseEnter = () => {
        setShowPopover(true);
    }

    const handleMouseLeave = () => {
        setShowPopover(false);
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarWrapper}>
                <Logo />
                <div className={styles.navbarLinks}>
                    {
                        user?.loggedIn &&
                        <>
                            <Link
                                href="/"
                                className={`${styles.navbarLinkLeft} ${(activeLink === "/") && styles.navbarLinkActive}`}
                            ><span>Home</span></Link>
                            <Link
                                href={`/${user?.addr}`}
                                className={`${styles.navbarLinkRight} ${(activeLink === `/${user?.addr}`) && styles.navbarLinkActive}`}
                            ><span>Profile</span></Link>
                        </>
                    }
                </div>
                <div className={styles.navbarSearchbar}>
                    <SearchBar />
                </div>
                {
                    user?.loggedIn
                        ? <div className={styles.navbarProfile}>
                            <div
                                className={styles.navbarProfileWrapper}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className={styles.navbarProfileInfo}>
                                    <div className={styles.navbarImg}>
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
                                    </div>
                                    <div className={styles.navbarProfileDetails}>
                                        <div className={styles.navbarProfileInfoName}>
                                            {userProfile?.name ? userProfile?.name : "Anonymous"}
                                        </div>
                                        <div className={styles.navbarProfileInfoAddress}>
                                            {`${user.addr.slice(0, 4)}...${user.addr.slice(-4)}`}
                                        </div>
                                    </div>
                                </div>
                                {
                                    showPopover &&
                                    <div className={styles.navbarPopover}>
                                        {
                                            !userProfile &&
                                            <div className={styles.navbarPopoverOption}>
                                                <Link href="/create">
                                                    <NewUserIcon />
                                                    <span>Create profile</span>
                                                </Link>
                                            </div>
                                        }
                                        {
                                            userProfile &&
                                            <div className={styles.navbarPopoverOption}>
                                                <Link href="/edit">
                                                    <SettingsIcon />
                                                    <span>Edit profile</span>
                                                </Link>
                                            </div>
                                        }
                                        <div className={styles.navbarPopoverOption}>
                                            <div onClick={() => logout()}>
                                                <LogoutIcon />
                                                <span>Logout</span>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        : <ConnectBtn />
                }
            </div>
        </nav>
    )
}
