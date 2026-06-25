import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../../../shared/lib/axiosInstance"
import { useNavigate, useOutletContext } from "react-router"
import { useToasts } from "../../../widgets/toasts/context/ToastContext"
import { getErrorText } from "../../../shared/utils/getErrorText"

export const useBookings = () => {
    return useQuery({
        queryKey: ['bookings'],
        queryFn: () => axiosInstance.get('/bookings').then(res => res.data)
    })
}

export const usePostBooking = () => {
    const { setShowModal } = useOutletContext()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: (bookingData) => axiosInstance.post('/bookings', bookingData).then(res => res.data),
        onSuccess: () => {
            showToast('Запись прошла успешно!')
            queryClient.invalidateQueries({ queryKey: [ 'bookings' ]})
            setShowModal(false)
            navigate('/bookings')
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}

export const usePatchBooking = () => {
    const { setShowModal } = useOutletContext()
    const queryClient = useQueryClient()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: ({id, status}) => axiosInstance.patch('/bookings/' + id, {status}).then(res => res.data),
        onSuccess: () => {
            showToast('Изменение статуса прошло успешно!')
            queryClient.invalidateQueries({ queryKey: [ 'bookings' ]})
            setShowModal(false)
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}