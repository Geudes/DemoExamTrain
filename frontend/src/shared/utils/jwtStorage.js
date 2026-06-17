export const jwtStorage = {
    setUserData: (userData) => {
        const { accessToken = undefined, refreshToken = undefined, user = undefined } = userData
        if(accessToken) localStorage.setItem('accessToken', accessToken);
        if(refreshToken) localStorage.setItem('refreshToken', refreshToken);
        if(user) localStorage.setItem('user', JSON.stringify(user));
    },

    getAccess: () => localStorage.getItem('accessToken'),
    getRefresh: () => localStorage.getItem('refreshToken'),
    getUser: () => {
        const user = localStorage.getItem('user')
        if(user) {
            return JSON.parse(user)
        }
    },

    clear: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
    }
}