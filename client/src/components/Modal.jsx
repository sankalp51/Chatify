import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ children, open }) {
    const dialog = useRef();

    useEffect(() => {
        if (open) {
            dialog.current.showModal();
        } else {
            dialog.current.close();
        }
    }, [open]);

    return createPortal(
        <dialog
            className="modal modal-bottom sm:modal-middle p-0 m-0 bg-transparent"
            ref={dialog}
            onClose={(e) => e.preventDefault()}
        >
            {children}
        </dialog>,
        document.getElementById("modal")
    );
}
