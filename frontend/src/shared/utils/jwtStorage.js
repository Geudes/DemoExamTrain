export const jwtStorage = {
    setUserData: (userData) => {
        const { accessToken = null, refreshToken = null, user = null } = userData

        if(accessToken) {
            localStorage.setItem('accessToken', accessToken)
        }

        if(refreshToken) {
            localStorage.setItem('refreshToken', refreshToken)
        }

        if(user) {
            localStorage.setItem('user', JSON.stringify(user))
        }
    },

    getAccess: () => localStorage.getItem('accessToken'),
    getRefresh: () => localStorage.getItem('refreshToken'),
    getUser: () => {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    },

    clear: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
    }
}