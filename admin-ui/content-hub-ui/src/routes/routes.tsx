import { lazy } from "react";
import DefaultLayout from "../components/layouts/adminLayout";
import UserLayout from "../components/layouts/userLayout";
import RolePermission from "../pages/system/role.permission";

const Home = lazy(() => import("../pages/home/Home"));
const ContentHub = lazy(() => import("../pages/home/ContentHub"));
const Login = lazy(() => import("../pages/auth/login/LoginUI"));
const ApiTest = lazy(() => import("../features/test/ApiTest"));
const Dashboard = lazy(() => import("../pages/dashboard/DashBoard"));
const RoleList = lazy(() => import("../features/system/Role"));
const RoleForm = lazy(() => import("../pages/system/role.form"));
const UserList = lazy(() => import("../features/system/User"));
const UserUpdate = lazy(() => import("../pages/system/user.update"));
const Regiter = lazy(() => import("../pages/auth/register/Register"));
const TagList = lazy(() => import("../features/content/TagComponent"));
const SeriesList = lazy(() => import("../features/content/SeriesComponent"));
const PostList = lazy(() => import("../features/content/PostComponent"));
const routes = [
  {
    path: "/admin",
    element: <DefaultLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "test", element: <ApiTest /> },
      { path: "roles", element: <RoleList /> },
      { path: "roles/create", element: <RoleForm /> },
      { path: "roles/edit/:id", element: <RoleForm /> },
      { path: "roles/:id/permissions", element: <RolePermission /> },
      { path: "users", element: <UserList /> },
      { path: "users/update/:id", element: <UserUpdate /> },
      { path: "tags", element: <TagList /> },
      { path: "series", element: <SeriesList /> },
      
    ],
  },
  {
    path: "/",
    element: <UserLayout />,
    children: [{ index: true, path: "ContentHub", element: <ContentHub /> },
      {path:"posts", element:<PostList/>},
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Regiter /> },
  {path:"posts", element:<PostList/>},
];

export default routes;
