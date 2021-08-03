import React, { useEffect, useCallback, useState, useRef } from 'react'
import { Route, Redirect, useHistory } from 'react-router-dom'
import UserHeader from '../components/Navbars/UserHeader'
// import UserFooter from '../components/Footer/UserFooter'
import { UserRouter } from './routes'
import { apiRefreshToken, apiUpdateUserProfile, apiTokenExpireCheck, apiLogoutRevokeToken } from '../api.js'
import '../assets/css/protected_page_style.css'
import useInterval from '../components/Timer/useInterval'
import { checkTokenExists, removeAllLocalStorage } from '../auth'
import { getCurrentWindowSize } from '../assets/js/get_winidow_size.js'

export default function ProtectedRoutes(props) {
    const history = useHistory()
    const mainPanel = useRef(null)
    const [allowRender, setAllowRender] = useState(false)
    const [username, setUsername] = useState('')

    const getRoutes = (routes) => {
        let route = null
        let index = 0
        for (let prop of routes) {
            if (prop.path_prefix === '/user' && history.location.pathname === prop.path_prefix + prop.path) {
                route = (
                    <Route
                        path={prop.path_prefix + prop.path}
                        // render={(props) => <prop.component {...props} />}
                        render={(props) => <prop.component {...props} currentWindowSize={getCurrentWindowSize()} />}
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
        // console.log('check user auth')
        // console.log(refresh_user_profile)
        const fetchUserAuth = async () => {
            await apiTokenExpireCheck()
                .then((res) => {
                    setAllowRender(true)
                    fetchUserProfile()
                })
                .catch((err) => {
                    let data = {
                        refresh: localStorage.getItem('refresh_token'),
                    }
                    apiRefreshToken(data)
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
                })
        }
        fetchUserAuth()
    }, [history, username])

    const requestRenderRoute = () => {
        let route = getRoutes(UserRouter)
        // alert('will be clicked')
        // if (window.performance && route !== null) {
        //     if (performance.navigation.type === 1) {
        //         // console.log('This page is reloaded')
        //         checkUserAuth()
        //     }
        // }
        return route
    }

    const renderRoute = requestRenderRoute()

    useInterval(() => {
        // console.log('will be check token expire')
        checkUserAuth()
        // console.log('token expire check has been done')
        // }, 900000)
    }, 60000)

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
