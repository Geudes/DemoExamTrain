import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../../../shared/lib/axiosInstance"
import { useNavigate } from "react-router"
import { useToasts } from "../../../widgets/toasts/context/ToastsContext"
import { getErrorText } from "../../../shared/utils/getErrorText"

export const useGetAppointments = () => {
    return useQuery({
        queryKey: ['appointments'],
        queryFn: () => axiosInstance.get('/appointments').then(res => res.data)
    })
}

export const usePostAppointment = () => {
    const queryClient = useQueryClient()
    const { showToast } = useToasts()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: (appointmentsData) => axiosInstance.post('/appointments', appointmentsData).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments']})
            showToast('Создание прошло успешно')
            navigate('/appointments')
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
        }
    )
}

export const usePatchAppointment = () => {
    const queryClient = useQueryClient()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: ({ status, id }) => axiosInstance.patch('/appointments/' + id, { status }).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments']})
            showToast('Изменение статуса прошло успешно')
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
        }
    )
}