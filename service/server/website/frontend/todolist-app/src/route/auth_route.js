import React from 'react'
// import { checkTokenExists } from '../auth'
import { Route, Redirect, useHistory } from 'react-router-dom'
import { AuthRouter } from './routes'
import '../assets/css/login_page_style.css'

export default function AuthRoutes() {
    const history = useHistory()

    const getRoutes = (routes) => {
        let route = null
        let index = 0
        for (let prop of routes) {
            // console.log(history.location.pathname)
            // console.log(prop.path_prefix + prop.path)
            if (prop.path_prefix === '/session' && (history.location.pathname === prop.path_prefix + prop.path)) {
                route = (
                    <Route
                        path={prop.path_prefix + prop.path}
                        render={(props) => <prop.component {...props} />}
                        key={index}
                    />
                )
                break
            }
            index++
        }
        index = 0
        return route
    }

    const renderRoute = () => {
        let route = getRoutes(AuthRouter)
        if (route === null) {
            return <Redirect to="/404" />
        }
        return <div>{route}</div>
    }

    return <div className="root">{renderRoute()}</div>
    // return <div>{renderRoute()}</div>
}
