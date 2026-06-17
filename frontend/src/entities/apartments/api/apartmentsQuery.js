import { useQuery } from "@tanstack/react-query"
import axiosInstance from "../../../shared/lib/axiosInstance"

export const useApartments = (offset, filters = {}) => {
    return useQuery({
        queryKey: ['apartments', { offset, filters }],
        queryFn: () => axiosInstance.get('/apartments', {
            params: {
                offset,
                limit: 4,
                ...filters
            }
        }).then(res => res?.data)
    })
}