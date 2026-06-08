import { useState } from "react"
import { ToastsContext } from "../context/toasts-context"

function ToastProvider({ children }) {

    const [toasts, setToasts] = useState([])

    const showToast = (message, type = 'success') => {
        const id = crypto.randomUUID()
        setToasts(toasts => [...toasts, { id, message, type }])
        const removeTimer = setTimeout(() => {
            setToasts(toasts => toasts.filter(t => t.id !== id))
            clearTimeout(removeTimer)
        }, 3000)
    }

    return (
        <ToastsContext.Provider value={{ showToast }}>
            <div className="toast-list">
                {
                    toasts.map(t => (
                        <div key={t.id} className={`toast toast-${t.type}`}>{t.message}</div>
                    ))
                }
            </div>
            {children}
        </ToastsContext.Provider>
    )
}

export default ToastProvider