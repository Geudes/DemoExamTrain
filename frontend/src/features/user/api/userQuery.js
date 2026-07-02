import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../../../shared/lib/axiosInstance"
import { useToasts } from "../../../widgets/toasts/context/ToastsContext"
import { useNavigate } from "react-router"
import { jwtStorage } from "../../../shared/utils/jwtStorage"
import { getErrorText } from "../../../shared/utils/getErrorText"

export const useGetUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => axiosInstance.get('/profile/me').then(res => res.data),
        enabled: !!jwtStorage.getAccess()
    })
}

export const useRegister = () => {
    const queryClient = useQueryClient()
    const { showToast } = useToasts()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: (userData) => axiosInstance.post('/auth/register', userData).then(res => res.data),
        onSuccess: (data) => {
            jwtStorage.setUserData(data)
            queryClient.setQueryData(['user'], data?.user)
            showToast('Регистрация прошла успешно')
            navigate('/profile')
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}

export const useLogin = () => {
    const queryClient = useQueryClient()
    const { showToast } = useToasts()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: (userData) => axiosInstance.post('/auth/login', userData).then(res => res.data),
        onSuccess: (data) => {
            jwtStorage.setUserData(data)
            queryClient.setQueryData(['user'], data?.user)
            showToast('Вход прошёл успешно')
            navigate('/')
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: (userData) => axiosInstance.put('/profile/me', userData).then(res => res.data),
        onSuccess: (data) => {
            jwtStorage.setUserData(data)
            queryClient.invalidateQueries({queryKey: ['user']})
            showToast('Обновление прошло успешно')
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}
export const useDeleteProfile = () => {
    const queryClient = useQueryClient()
    const { showToast } = useToasts()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: (id) => axiosInstance.delete('/profile/' + id).then(res => res.data),
        onSuccess: () => {
            jwtStorage.clear()
            queryClient.removeQueries(['user'])
            showToast('Удаление прошло успешно')
            navigate('/')
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}

export const useLogout = () => {
    const queryClient = useQueryClient()
    const { showToast } = useToasts()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: () => axiosInstance.post('/auth/logout').then(res => res.data),
        onSettled: () => {
            jwtStorage.clear()
            queryClient.removeQueries({ queryKey: ['user']})
            showToast('Выход прошёл успешно')
            navigate('/')
        }
    })
}
