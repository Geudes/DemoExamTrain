export const jwtStorage = {
    setAccess: (token) => localStorage.setItem('accessToken', token),
    setRefresh: (token) => localStorage.setItem('refreshToken', token),

    getAccess: () => localStorage.getItem('accessToken'),
    getRefresh: () => localStorage.getItem('refreshToken'),

    clear: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
    }
}