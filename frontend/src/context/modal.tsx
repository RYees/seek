import React, { ReactNode, createContext } from "react";
import useModal from "@/hooks/useModal";
import Modal from "@/components/Modal";
import { IModalType } from "@/types";

interface ModalContextInterface {
    modal: boolean;
    modalType: IModalType | null;
    handleModal: (obj: IModalType | null) => void;
}

const ModalContext = createContext<ModalContextInterface>({
    modal: false,
    modalType: null,
    handleModal: () => { },
});
ModalContext.displayName = "ModalContext";

const ModalProvider = ({ children }: { children: ReactNode }) => {
    const { modal, modalType, handleModal } = useModal();

    return (
        <ModalContext.Provider value={{ modal, modalType, handleModal }}>
            <Modal />
            {children}
        </ModalContext.Provider>
    );
};

export { ModalContext, ModalProvider };
