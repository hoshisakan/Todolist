import TodoBook from '../views/book/TodoBook'
import CompletedList from '../views/book/CompletedList'
import UserProfile from '../views/user/UserProfile'
import LoginPage from '../views/user/LoginPage'
import LogoutPage from '../views/user/LogoutPage'
import RegisterPage from '../views/user/RegisterPage'
// import { NotMatch404 } from '../views/error/NotMatch404'
import ApplyResetPasswordPage from '../views/user/ApplyResetPasswordPage'
import ResetPasswordPage from '../views/user/ResetPasswordPage'
import RegisterValidatePage from '../views/user/RegisterValidatePage'


export const UserRouter = [
    {
        path: '/todo/book',
        name: 'TodoBook',
        icon: '',
        component: TodoBook,
        path_prefix: '/user',
    },
    {
        path: '/completed/book',
        name: 'CompletedList',
        icon: '',
        component: CompletedList,
        path_prefix: '/user',
    },
    {
        path: '/profile',
        name: 'UserProfile',
        icon: '',
        component: UserProfile,
        path_prefix: '/user',
    },
]

export const AuthRouter = [
    {
        path: '/login',
        name: 'Login',
        icon: '',
        component: LoginPage,
        path_prefix: '/session',
    },
    {
        path: '/logout',
        name: 'Logout',
        icon: '',
        component: LogoutPage,
        path_prefix: '/session',
    },
    {
        path: '/register',
        name: 'Register',
        icon: '',
        component: RegisterPage,
        path_prefix: '/session',
    },
    {
        path: '/confirm-account',
        name: 'ConfirmAccount',
        icon: '',
        component: RegisterValidatePage,
        path_prefix: '/session'
    },
    {
        path: '/forget-password',
        name: 'ApplyResetPassword',
        icon: '',
        component: ApplyResetPasswordPage,
        path_prefix: '/session',
    },
    {
        path: '/reset-password',
        name: 'ResetPassword',
        icon: '',
        component: ResetPasswordPage,
        path_prefix: '/session'
    }
]
