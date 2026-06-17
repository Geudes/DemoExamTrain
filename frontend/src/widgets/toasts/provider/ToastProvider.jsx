import { useState } from "react";
import { ToastsContext } from "../context/ToastsContex";

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, status = "success") => {
    const id = crypto.randomUUID();
    setToasts((toasts) => [...toasts, { message, status, id }]);
    const timer = setTimeout(() => {
      setToasts((toasts) => toasts.filter((t) => t?.id !== id));
      clearTimeout(timer);
    }, 3000);
  };

  return (
    <ToastsContext.Provider value={{ showToast }}>
      <div className="toasts-list">
        {
          toasts?.map(t => (
            <div key={t?.id} className={`toast toast-${t?.status}`}>
              <span>{t?.message}</span>
            </div>
          ))
        }
      </div>
      {children}
    </ToastsContext.Provider>
  );
};

export default ToastProvider;
