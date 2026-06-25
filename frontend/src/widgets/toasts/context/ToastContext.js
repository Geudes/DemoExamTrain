import { createContext, useContext } from "react";

const ToastContext = createContext(null)

export default ToastContext

export const useToasts = () => {
    return useContext(ToastContext)
}