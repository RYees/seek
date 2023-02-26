import { useContext, useEffect, useState } from "react";
import styles from "@/styles/FloatBtn.module.css";
import { ActionsContext } from "@/context/actions";
import Sparkles from "../Sparkles";
import PresentIcon from "../Icons/PresentIcon";

export default function FloatBtn() {
    const { claim } = useContext(ActionsContext);
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        handleDisplay();

        window.addEventListener("resize", handleDisplay);

        return () => {
            window.removeEventListener("resize", handleDisplay);
        }
    }, []);

    const handleDisplay = () => {
        if (document.body.clientWidth < 768) {
            setShow(true);
        } else {
            setShow(false);
        }
    }

    return (
        <>
            {
                show &&
                <button
                    className={styles.floatBtn}
                    onClick={() => claim()}
                >
                    <Sparkles>
                        <div><PresentIcon /></div>
                    </Sparkles>
                </button>
            }
        </>
    );
}
