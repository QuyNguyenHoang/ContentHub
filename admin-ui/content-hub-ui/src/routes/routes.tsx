import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import DefaultLayout from '../components/layouts/adminLayout'
import RolePermission from '../pages/system/role.permission'

const Home = lazy(() => import('../pages/home/Home'))
const Login = lazy(() => import('../pages/auth/login/Login'))
const ApiTest = lazy(() => import('../features/test/ApiTest'))
const Dashboard = lazy(() => import('../pages/dashboard/DashBoard'))
const RoleList = lazy(() => import('../features/system/Role'))
const RoleForm = lazy(() => import('../pages/system/role.form'))
const routes = [
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'test', element: <ApiTest /> },
      { path: 'roles', element: <RoleList /> },
      { path: 'roles/create', element: <RoleForm /> },
      { path: 'roles/edit/:id', element: <RoleForm /> },
      { path: 'roles/:id/permissions', element: <RolePermission /> }


    ],

  },
  { path: '/login', element: <Login /> },
  { path: '/home', element: <Navigate to="/" replace /> },

]

export default routes
