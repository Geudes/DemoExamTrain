import { useQuery } from "@tanstack/react-query"
import axiosInstance from "../../../shared/lib/axiosInstance"

export const useApartments = (offset, filters = {}) => {
    return useQuery({
        queryKey: ['apartments', { offset, filters }],
        queryFn: () => axiosInstance.get('/apartments', {
            params: {
                offset,
                limit: 2,
                ...filters,
            }
        }).then(res => res.data)
    })
}


export const useApartment = (id) => {
    return useQuery({
        queryKey: ['apartments', { id }],
        queryFn: () => axiosInstance.get('/apartments/' + id).then(res => res.data)
    })
}

export const useCities = () => {
    return useQuery({
        queryKey: ['cities'],
        queryFn: () => axiosInstance.get('/apartments', { params: { limit: 20 }}).then(res => {
            const { items = [] } = res.data
            return [...new Set(items.map(a => a.city))]
        }),
        staleTime: 1000*60*60
    })
}

