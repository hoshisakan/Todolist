import axios from 'axios'

const apiAccountRequest = axios.create({
    // baseURL: 'http://192.168.1.112:9001/api/users',
    // baseURL: 'http://192.168.1.112:9028/api/users',
    baseURL: 'https://todolist.serveirc.com/api/users',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

const apiBookTodoRequest = axios.create({
    // baseURL: 'http://192.168.1.112:9001/api/book',
    // baseURL: 'http://192.168.1.112:9028/api/book',
    baseURL: 'https://todolist.serveirc.com/api/book',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

export const apiUserLogin = (data) =>
    apiAccountRequest.post('/sign-in', data)

export const apiRefreshToken = (data) =>
    apiAccountRequest.post('/token-refresh', data)

// export const apiRefreshToken = (data) =>
//     apiAccountRequest.post('/token-refresh', data, {
//         headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
//     })

// For use headers send access token, such as 'Authorization Bearer token'
// export const apiUpdateUserProfile = () =>
//     apiAccountRequest.post(
//         '/profile',
//         {},
//         {
//             headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
//         }
//     )

export const apiUpdateUserProfile = () =>
    apiAccountRequest.get(
        '/profile',
        {
            headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
        }
    )

export const apiLogoutRevokeToken = (data) =>
    apiAccountRequest.post('/logout', data)

export const apiRegisterUser = (data) =>
    apiAccountRequest.post('', data)

export const apiApplyResetPassword = (data) =>
    apiAccountRequest.post('/forget-password', data)

export const apiResetPassword = (data) =>
    apiAccountRequest.post('/reset-password', data)

export const apiRegisterValidate = (data) =>
    apiAccountRequest.post('/validate-account', data)

export const apiReissueRegister = (data) =>
    apiAccountRequest.post('/reissue-activate', data)

// export const apiTokenExpireCheck = () =>
//     apiAccountRequest.get(
//         '/token-expire-check',
//         {
//             headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
//         }
//     )

export const apiTokenExpireCheck = () =>
    apiAccountRequest.post(
        '/token-expire-check',
        {
            "token": localStorage.getItem('access_token')
        }
    )

// GET Method send params
export const apiFetchBookTodo = (order_by, is_checked) =>
    apiBookTodoRequest.get('', {
        params: {
            order_by: order_by,
            is_checked: is_checked
        },
        headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
    })

export const apiAddBookTodo = (data) =>
    apiBookTodoRequest.post('', data, {
        headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
    })

export const apiEditBookTodo = (id, data) =>
    apiBookTodoRequest.put(`/${id}`, data, {
        headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
    })

export const apiDeleteBookTodo = (id) =>
    apiBookTodoRequest.delete(`/${id}`, {
        headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
    })


export const apiCheckBookTodo = (id, is_checked) =>
    apiBookTodoRequest.patch(`/${id}`,{
        "is_read": is_checked
    }, {
        headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
    })