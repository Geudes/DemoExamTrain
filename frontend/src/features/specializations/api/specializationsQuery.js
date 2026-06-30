import { useQuery } from "@tanstack/react-query"
import axiosInstance from "../../../shared/lib/axiosInstance"

export const useGetSpecializations = () => {
    return useQuery({
        queryKey: ['specializations'],
        queryFn: () => axiosInstance.get('/specializations').then(res => res.data)
    })
}