import { useState, ChangeEvent, KeyboardEvent } from "react";
import styles from "@/styles/SearchBar.module.css";
import SearchIcon from "./Icons/SearchIcon";
import { useRouter } from "next/router";

export default function SearchBar() {
    const router = useRouter();
    const [search, setSearch] = useState<string>("");

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch((e.target.value).toLocaleLowerCase().trim());
    }

    const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleOnClick();
        }
    }

    const handleOnClick = () => {
        if ((search.slice(0, 2) !== "0x") || (search.length !== 18)) {
            alert("You need to input an address.");
            return;
        }

        // Reset search bar
        setSearch("");

        // Redirect to account page
        router.push(`/${search}`);
    }

    return (
        <div className={styles.searchBar}>
            <div
                className={styles.searchBarIcon}
                onClick={handleOnClick}
            >
                <SearchIcon />
            </div>
            <input
                onChange={handleOnChange}
                onKeyDown={handleOnKeyDown}
                value={search}
                placeholder="Search address.."
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
            ></input>
        </div>
    );
}
