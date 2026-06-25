export const jwtStorage = {
    setUserData(data) {
        const { accessToken = undefined, refreshToken = undefined, user = undefined } = data

        if(accessToken) localStorage.setItem('accessToken', accessToken)
        if(refreshToken) localStorage.setItem('refreshToken', refreshToken)
        if(user) localStorage.setItem('user', JSON.stringify(user))
    },

    getAccess: () => localStorage.getItem('accessToken'),
    getRefresh: () => localStorage.getItem('refreshToken'),
    getUser: () => localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : undefined,
    
    clear() {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
    }
}