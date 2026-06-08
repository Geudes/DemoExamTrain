import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../lib/axios-instance"
import { jwtStorage } from "../utils/jwt-storage"
import { useNavigate } from "react-router"
import { useToasts } from "../../widgets/toasts/context/toasts-context"
import { getErrorText } from "../utils/get-error-text"


// QUERY

export const useGetMe = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => axiosInstance.get('/profile/me').then(response => response.data),
        enabled: !!jwtStorage.getAccess()
    })
}

export const useTeachers = (offset, filters = {}, limit = 2) => {
    return useQuery({
        queryKey: ['teachers', { offset, filters }],
        queryFn: () => axiosInstance.get('/teachers', {params: {...filters, offset, limit}}).then(response => response.data),
    })
}

export const useTeacher = (id) => {
    return useQuery({
        queryKey: ['teachers', 'details', { id }],
        queryFn: () => axiosInstance.get('/teachers/' + id).then(response => response.data),
    })
}

export const useInstruments = () => {
    return useQuery({
        queryKey: ['instruments'],
        queryFn: () => axiosInstance.get('/instruments').then(response => response.data),
    })
}

export const useLessons = () => {
    return useQuery({
        queryKey: ['lessons'],
        queryFn: () => axiosInstance.get('/lessons').then(response => response.data),
    })
}

// MUTATIONS

export const useRegister = () => {
    const client = useQueryClient()
    const navigate = useNavigate()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: (userData) => axiosInstance.post('/auth/register', userData).then(response => response.data),
        onSuccess: (data) => {
            jwtStorage.setTokens(data)
            client.setQueryData(['user', data?.user])
            showToast('Вы успешно зарегестрировались!', 'success')
            navigate('/login')
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}

export const useLogin = () => {
    const client = useQueryClient()
    const navigate = useNavigate()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: (userData) => axiosInstance.post('/auth/login', userData).then(response => response.data),
        onSuccess: (data) => {
            jwtStorage.setTokens(data)
            client.setQueryData(['user', data?.user])
            showToast('Вы успешно вошли!', 'success')
            navigate('/')
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}

export const useLogout = () => {
    const client = useQueryClient()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: () => axiosInstance.post('/auth/logout'),
        onSettled: () => {
            showToast('Вы вышли')
            jwtStorage.clear()
            client.removeQueries(['user'])
        }
    })
}

export const useUpdateMe = () => {
    const client = useQueryClient()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: (userData) => axiosInstance.put('profile/me', userData).then(response => response.data),
        onSuccess: () => {
            showToast('Данные обновлены!', 'success')
            client.invalidateQueries(['user'])
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}


export const useDeleteMe = () => {
    const client = useQueryClient()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: (id) => axiosInstance.delete('profile/' + id).then(response => response.data),
        onSuccess: () => {
            showToast('Аккаунт удалён!', 'success')
            client.invalidateQueries(['user'])
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}

export const useAddLesson = () => {
    const client = useQueryClient()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: (lessonData) => axiosInstance.post('lessons', lessonData).then(response => response.data),
        onSuccess: () => {
            showToast('Вы записались на урок!', 'success')
            client.invalidateQueries(['lessons'])
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}


export const usePatchLesson = () => {
    const client = useQueryClient()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: ({ id, lessonData }) => axiosInstance.patch('lessons/' + id, lessonData).then(response => response.data),
        onSuccess: () => {
            showToast('Вы записались на урок!', 'success')
            client.invalidateQueries(['lessons'])
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}


export const useAddInstruments = () => {
    const client = useQueryClient()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: (instrumentData) => axiosInstance.post('instruments', instrumentData).then(response => response.data),
        onSuccess: () => {
            showToast('Вы создали инструмент!', 'success')
            client.invalidateQueries(['instruments'])
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}

export const useSelectedInstruments = () => {
    const client = useQueryClient()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: (insrumentsArr) => axiosInstance.post('instruments/selected', { instrumentIds: insrumentsArr }).then(response => response.data),
        onSuccess: () => {
            showToast('Вы добавили новый инструмент к прогрмме обучения!', 'success')
            client.invalidateQueries(['user'])
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}

export const useDeleteSelectedInstruments = () => {
    const client = useQueryClient()
    const { showToast } = useToasts()
    return useMutation({
        mutationFn: (insrumentsArr) => axiosInstance.delete('instruments/selected', {
            data: { instrumentIds: insrumentsArr }
        }).then(response => response.data),
        onSuccess: () => {
            showToast('Вы добавили новый инструмент к прогрмме обучения!', 'success')
            client.invalidateQueries(['user'])
        },
        onError: (error) => {
            showToast(getErrorText(error), 'error')
        }
    })
}









