import React, { useEffect, useCallback, useState, useRef } from 'react'
import { Route, Redirect, useHistory } from 'react-router-dom'
import UserHeader from '../components/Navbars/UserHeader'
// import UserFooter from '../components/Footer/UserFooter'
import { UserRouter } from './routes'
import { apiRefreshToken, apiUpdateUserProfile, apiTokenExpireCheck, apiLogoutRevokeToken } from '../api.js'
import '../assets/css/protected_page_style.css'
import useInterval from '../components/Timer/useInterval'
import { checkTokenExists, removeAllLocalStorage } from '../auth'

export default function ProtectedRoutes(props) {
    const history = useHistory()
    const mainPanel = useRef(null)
    const [allowRender, setAllowRender] = useState(false)
    const [username, setUsername] = useState('')
    const [checkTokenExpireTime, setCheckTokenExpireTime] = useState(60000) // default check token epxire time 1 minutes

    const getRoutes = (routes) => {
        let route = null
        let index = 0
        for (let prop of routes) {
            if (prop.path_prefix === '/user' && history.location.pathname === prop.path_prefix + prop.path) {
                route = (
                    <Route
                        path={prop.path_prefix + prop.path}
                        render={(props) => <prop.component {...props} />}
                        key={index}
                    />
                )
                // console.log('current route: ' + history.location.pathname)
                break
            }
            index++
        }
        index = 0
        return route
    }

    const checkUserAuth = useCallback(() => {
        // console.log('check user auth')
        const fetchUserProfile = async () => {
            if (username.length < 1 || username === '') {
                // console.log('fetch update user profile')
                await apiUpdateUserProfile()
                    .then((res) => {
                        let res_data = res.data.info
                        setUsername(res_data['user'])
                        // console.log('get user profile')
                    })
                    .catch((err) => {
                        // console.error('error updating user profile: ' + err)
                    })
            }
        }
        const refreshTokenRequest = async () => {
            let data = {
                refresh: localStorage.getItem('refresh_token'),
            }
            await apiRefreshToken(data)
                .then((res) => {
                    localStorage.setItem('access_token', res.data['access'])
                    // console.log('token expired time: ' + res.data['exp'])
                    setAllowRender(true)
                    fetchUserProfile()
                })
                .catch((err) => {
                    setAllowRender(false)
                    let data = {
                        refresh: localStorage.getItem('refresh_token'),
                    }
                    apiLogoutRevokeToken(data)
                        .then((res) => {
                            removeAllLocalStorage()
                            if (!checkTokenExists() && res.data['allow_logout'] === true) {
                                history.push('/session/login')
                            }
                        })
                        .catch((err) => {
                            // console.error(err)
                            removeAllLocalStorage()
                            history.push('/session/login')
                        })
                })
        }
        const fetchUserAuth = async () => {
            await apiTokenExpireCheck()
                .then((res) => {
                    let data = res.data
                    let token_time_left = data['token_time_left']
                    // console.log('token time left: ' + token_time_left)
                    if (token_time_left > 60) {
                        setCheckTokenExpireTime(60000)
                    } else if (token_time_left === 60) {
                        setCheckTokenExpireTime(20000)
                    } else if (token_time_left >= 30 && token_time_left <= 60) {
                        setCheckTokenExpireTime(10000)
                    } else if (token_time_left <= 30) {
                        refreshTokenRequest()
                    }
                    // console.log('changed timer check token expired time: ' + checkTokenExpireTime)
                    setAllowRender(true)
                    fetchUserProfile()
                })
                .catch((err) => {
                    refreshTokenRequest()
                })
        }
        fetchUserAuth()
    }, [history, username])

    const requestRenderRoute = () => {
        let route = getRoutes(UserRouter)
        // alert('will be clicked')
        if (window.performance) {
            if (performance.navigation.type === 1) {
                checkUserAuth()
            }
        }
        return route
    }

    const renderRoute = requestRenderRoute()

    useInterval(() => {
        // console.log('will be check token expire')
        checkUserAuth()
        // console.log('token expire check has been done')
        // }, 900000)
    }, checkTokenExpireTime)

    useEffect(() => {
        checkUserAuth()
    }, [checkUserAuth])

    return (
        <div>
            <div className="wrapper">
                <div className="mainPanel" ref={mainPanel}>
                    {allowRender ? (
                        renderRoute === null ? (
                            <Redirect to="/404" />
                        ) : (
                            <div>
                                <UserHeader username={username} />
                                {renderRoute}
                                {/* <UserFooter /> */}
                            </div>
                        )
                    ) : null}
                </div>
            </div>
        </div>
    )
}
