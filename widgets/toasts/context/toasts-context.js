import { createContext, useContext } from "react";

export const ToastsContext = createContext(null)

export const useToasts = () => {
    return useContext(ToastsContext)
}