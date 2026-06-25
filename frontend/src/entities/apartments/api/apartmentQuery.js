import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../../../shared/lib/axiosInstance"
import { useToasts } from "../../../widgets/toasts/context/ToastContext"
import { getErrorText } from "../../../shared/utils/getErrorText"

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

export const useDeleteApartments = () => {
    const { showToast } = useToasts()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id) => axiosInstance.delete('/apartments/' + id),
        onSuccess: () => {
            showToast('Удалени прошло успешно')
            queryClient.invalidateQueries({ queryKey: ['apartments'] })
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}

