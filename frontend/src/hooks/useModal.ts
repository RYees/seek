import { useState } from "react";
import { IModalType } from "@/types";

const useModal = () => {
    const [modal, setModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<IModalType | null>(null);

    const handleModal = (type: IModalType | null) => {
        setModal(type ? true : false);
        if (type) {
            setModalType(type);
        }
    };

    return {
        modal,
        modalType,
        handleModal,
    };
};

export default useModal;
