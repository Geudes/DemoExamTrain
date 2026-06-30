import { useQuery } from "@tanstack/react-query"
import axiosInstance from "../../../shared/lib/axiosInstance"

export const useGetDoctors = (filters) => {
    return useQuery({
        queryKey: ['doctors', { filters }],
        queryFn: () => axiosInstance.get('/doctors', {
            params: {
                ...filters,
            }
        }).then(res => res.data)
    })
}

export const useGetDoctor = (id) => {
    return useQuery({
        queryKey: ['doctors', 'details', { id }],
        queryFn: () => axiosInstance.get('/doctors/' + id).then(res => res.data)
    })
}

