import { lazy } from "react";
import DefaultLayout from "../components/layouts/adminLayout";
import UserLayout from "../components/layouts/userLayout";
import RolePermission from "../pages/system/role.permission";

const Home = lazy(() => import("../pages/home/Home"));
const ContentHub = lazy(() => import("../pages/home/ContentHub"));
const Login = lazy(() => import("../pages/auth/login/LoginUI"));
const ApiTest = lazy(() => import("../features/test/ApiTest"));
const Dashboard = lazy(
  () => import("../features/dashboard/DashBoardComponent"),
);
const RoleList = lazy(() => import("../features/system/Role"));
const RoleForm = lazy(() => import("../pages/system/role.form"));
const UserUpdate = lazy(() => import("../pages/system/user.update"));
const Regiter = lazy(() => import("../pages/auth/register/Register"));
const TagList = lazy(() => import("../features/content/TagComponent"));
const SeriesList = lazy(() => import("../features/content/SeriesComponent"));
const PostList = lazy(() => import("../features/content/PostComponent"));
const NewPost = lazy(() => import("../pages/content/PostForUserUI/NewPostUI"));
const PostDetail = lazy(
  () => import("../features/content/PostDetailComponent"),
);
const Comment = lazy(() => import("../features/content/CommentBox"));
const PostManagement = lazy(
  () => import("../features/content/PostManagementComponent"),
);
const UserManagement = lazy(
  () => import("../features/system/UserManagementComponent"),
);
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
      { path: "users/update/:id", element: <UserUpdate /> },
      { path: "tags", name: "Tags", element: <TagList /> },
      { path: "series", name: "Series", element: <SeriesList /> },
      { path: "posts", name: "Posts", element: <PostManagement /> },
      { path: "users", name: "Users", element: <UserManagement /> },
    ],
  },
  {
    element: <UserLayout />,
    children: [
      { index: true, path: "ContentHub", element: <ContentHub /> },
      {
        index: true,
        element: <ContentHub />,
      },
      {
        path: "home",
        element: <ContentHub />,
      },
      { path: "posts", element: <PostList /> },
      {
        path: "posts/:slug",
        element: <PostDetail />,
      },
    ],
  },
  {
    path: "/",
    children: [
      {
        index: true,
        element: <ContentHub />,
      },
      {
        path: "home",
        element: <ContentHub />,
      },
      {
        path: "/new",
        element: <NewPost />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Regiter /> },
  { path: "posts", element: <PostList /> },
  { path: "/comment", element: <Comment /> },
];

export default routes;
