import { useState } from "react";
import { ToastsContext } from "../context/ToastsContext";

const ToastsProvider = ({ children }) => {

    const [ toasts, setToasts ] = useState([])

    const showToast = (message, status = 'success') => {
        const id = crypto.randomUUID()
        setToasts(toasts => [...toasts, { id, message, status}])
        const timerId = setTimeout(() => {
            setToasts(toasts => toasts.filter(t => t.id !== id))
            clearTimeout(timerId)
        }, 3500);
    }

  return (
    <ToastsContext.Provider value={{ showToast }}>
        {children}
        <div className="toasts-list">
            {
                toasts.map(t => (
                    <div key={t.id} className={`toast ${t.status}`}>
                        {t.message}
                    </div>
                ))
            }
        </div>
    </ToastsContext.Provider>
  );
};

export default ToastsProvider;