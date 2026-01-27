import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import DefaultLayout from '../components/layouts/adminLayout'

const Home = lazy(() => import('../pages/home/Home'))
const Login = lazy(() => import('../pages/auth/login/Login'))
const ApiTest = lazy(() => import('../features/test/ApiTest'))
const Dashboard = lazy(() => import('../pages/dashboard/DashBoard'))

const routes = [
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'test', element: <ApiTest /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/home', element: <Navigate to="/" replace /> },

]

export default routes
