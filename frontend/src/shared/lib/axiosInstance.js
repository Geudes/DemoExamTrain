import axios from 'axios'
import { jwtStorage } from '../utils/jwtStorage'

const baseURL = import.meta.env.VITE_BASE_URL

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosInstance.interceptors.request.use(
    config => {
        const accessToken = jwtStorage.getAccess()
        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    }, error => Promise.reject(error)
)

export default axiosInstance