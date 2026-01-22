import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const Home = lazy(() => import('../pages/home/Home'))
const Login = lazy(() => import('../pages/auth/login/Login'))
const ApiTest = lazy(() => import('../features/test/ApiTest'))

const routes = [
  { path: '/login', element: <Login /> },
  { path: '/', element: <Home /> },
  { path: '/home', element: <Navigate to="/" replace /> },
  { path: '/test', element: <ApiTest /> },
]

export default routes
