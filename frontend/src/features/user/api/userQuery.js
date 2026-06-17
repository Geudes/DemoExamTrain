import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../../../shared/lib/axiosInstance"
import { useNavigate } from "react-router"
import { useToasts } from "../../../widgets/toasts/context/ToastsContex"
import { jwtStorage } from "../../../shared/utils/jwtStorage"
import { getErrorText } from "../../../shared/utils/getErrorText"

export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => axiosInstance.get('/profile/me').then(res => res.data),
    })
}

export const useRegister = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: (data) => axiosInstance.post('/auth/register', data).then(res => res.data),
        onSuccess: (res) => {
            jwtStorage.setUserData(res)
            queryClient.setQueryData(['user'], res?.user)
            navigate('/login')
            showToast('Регистрация прошла успешно')
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
        mutationFn: (data) => axiosInstance.post('/auth/login', data).then(res => res.data),
        onSuccess: (res) => {
            jwtStorage.setUserData(res)
            queryClient.setQueryData(['user'], res?.user)
            navigate('/')
            showToast('Вход прошёл успешно')
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}

export const useLogout = () => {
    const queryClient = useQueryClient()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: (data) => axiosInstance.post('/auth/logout', data).then(res => res.data),
        onSuccess: () => {
            jwtStorage.clear()
            queryClient.removeQueries(['user'])
            showToast('Выход прошёл успешно')
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        },
    })
}