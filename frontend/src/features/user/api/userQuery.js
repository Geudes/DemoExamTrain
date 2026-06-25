import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../../../shared/lib/axiosInstance"
import { useNavigate } from "react-router"
import { useToasts } from "../../../widgets/toasts/context/ToastContext"
import { jwtStorage } from "../../../shared/utils/jwtStorage"
import { getErrorText } from "../../../shared/utils/getErrorText"

export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => axiosInstance.get('/profile/me').then(res => res.data),
        staleTime: Infinity,
        gcTime: Infinity,
    })
}

export const useRegister = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: (userData) => axiosInstance.post('/auth/register', userData).then(res => res?.data),
        onSuccess: (data) => {
            jwtStorage.setUserData(data)
            queryClient.setQueryData(['user'], data?.user)

            showToast('Регистрация прошла успешно!')
            navigate('/profile')
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}

export const useLogin = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: (userData) => axiosInstance.post('/auth/login', userData).then(res => res?.data),
        onSuccess: (data) => {
            jwtStorage.setUserData(data)
            queryClient.setQueryData(['user'], data?.user)

            showToast('Вход прошёл успешно!')
            navigate('/')
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}

export const useLogout = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: () => axiosInstance.post('/auth/logout').then(res => res?.data),
        onSettled: () => {
            jwtStorage.clear()
            queryClient.removeQueries(['user'])

            showToast('Вы успешно вышли!')
            navigate('/')
        }
    })
}