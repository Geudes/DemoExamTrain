import axios from 'axios'
import { jwtStorage } from '../utils/jwt-storage'

const baseURL = import.meta.env.VITE_BASE_URL

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = jwtStorage.getAccess()

        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config
    }, (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        const isRefreshing = originalRequest.url.includes('/auth/refresh')

        if(isRefreshing) {
            jwtStorage.clear()
            return Promise.reject(error)
        }

        if(error?.response.status !== 401) {
            return Promise.reject(error)
        }

        const refreshToken = jwtStorage.getRefresh()

        if(!refreshToken) {
            jwtStorage.clear()
            return Promise.reject(error)
        }

        try {
            const { data } = await axios.post(baseURL + '/auth/refresh', { refreshToken })

            if(!data?.accessToken) {
                throw new Error(data?.error)
            }

            jwtStorage.setAccess(data?.accessToken)
            return axiosInstance(originalRequest)

        } catch (refreshError) {
            jwtStorage.clear()
            return Promise.reject(refreshError || error)
        }
    }
)

export default axiosInstance