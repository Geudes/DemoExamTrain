import { useState } from "react";
import ToastContext from "../context/ToastContext";

const ToastProvider = ({ children }) => {

    const [ toasts, setToasts ] = useState([])

    const showToast = (message, type='success') => {
        const id = crypto.randomUUID()
        setToasts(toasts => [...toasts, { id, message, type }])

        const timer = setTimeout(() => {
            setToasts(toasts => toasts.filter(t => t.id !== id))
            clearTimeout(timer)
        }, 3500);
    }

    const value = {
        showToast
    }

  return (
    <ToastContext.Provider value={value}>
        <div className="toasts-list">
            {
                toasts.map(t => (
                    <div key={t.id} className={`toast toast-${t.type}`}>
                        <span>{t.message}</span>
                    </div>
                ))
            }
        </div>
        {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;