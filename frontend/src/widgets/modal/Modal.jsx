import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children, heading, isOpen, onClose }) => {
  const modalRoot = document.getElementById("modal-root");

  const ref = useRef()

  useEffect(() => {
    document.addEventListener("keydown", (e) =>
      e?.key === "Escape" ? onClose() : null,
    );
    return document.removeEventListener("keydown", (e) =>
      e?.key === "Escape" ? onClose : null,
    );
  }, [onClose]);

  if (!isOpen) return;

  return createPortal(
    <div ref={ref} className="overlay" onClick={(e) => {
      if(e.target === ref.current) {
        onClose()
      }
    }}>
      <div className="modal">
        <div className="heading">
          <button onClick={onClose} className="modal-close btn error">
            Закрыть
          </button>
          <h1>{heading}</h1>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>,
    modalRoot,
  );
};

export default Modal;
