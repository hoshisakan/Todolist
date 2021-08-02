export const setToken = (access_token, refresh_token) => {
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
}

export const getToken = () => {
    console.log('access token: ' + localStorage.getItem('access_token'))
    console.log('refresh token: ' + localStorage.getItem('refresh_token'))
}

export const setAccessToken = (access_token) => {
    localStorage.setItem('access_token', access_token)
}

export const getAccessToken = () => {
    localStorage.getItem('access_token')
}

export const setRefreshToken = (refresh_token) => {
    localStorage.setItem('refresh_token', refresh_token)
}

export const getRefreshToken = () => {
    localStorage.getItem('refresh_token')
}

export const removeToken = () => {
    localStorage.removeItem('access_token')
}

export const checkTokenExists = () => {
    return localStorage.getItem('access_token') !== null && localStorage.getItem('access_token') !== undefined
}

export const removeAllLocalStorage = () => {
    localStorage.clear()
    sessionStorage.clear()
}