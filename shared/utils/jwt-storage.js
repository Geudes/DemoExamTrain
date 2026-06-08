export const jwtStorage = {
    setTokens: (data) => {
        localStorage.setItem('accessToken', data?.accessToken)
        localStorage.setItem('refreshToken', data?.refreshToken)
    },

    getAccess: () => localStorage.getItem('accessToken'),
    getRefresh: () => localStorage.getItem('refreshToken'),

    clear() {
        localStorage.removeItem('accessToken'),
        localStorage.removeItem('refreshToken')
    }
} 