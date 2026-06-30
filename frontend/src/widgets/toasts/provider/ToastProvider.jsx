import { useState } from "react";
import { ToastContext } from "../context/ToastContext";

const ToastProvider = ({ children }) => {

    const [ toasts, setToasts ] = useState([])

    const showToast = (message, status = 'success') => {
        const id = crypto.randomUUID()
        setToasts(toasts => [...toasts, { id, message, status }])

        const timerId = setTimeout(() => {
            setToasts(toasts => toasts.filter(t => t.id !== id))
            clearTimeout(timerId)
        }, 3500)
    }

  return (
    <ToastContext.Provider value={{ showToast }}>
        {children}
        <div className="toast-list">
            {
                toasts.map(t => (
                    <div key={t.id} className={"toast " + t.status}>
                        <span>{t.message}</span>
                    </div>
                ))
            }
        </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;