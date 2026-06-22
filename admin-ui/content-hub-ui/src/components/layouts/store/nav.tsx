import CIcon from "@coreui/icons-react";
import { BsEye } from "react-icons/bs";
import {
  cilBell,
  cilPlus,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilTag,
  cilLayers,
  cilDescription,
  cilLockLocked,
  cilSettings,
  cilChartPie,

} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

const nav = [
  //Dashboard
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/admin/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: "info",
      text: "NEW",
    },
  },

  {
    component: CNavTitle,
    name: "Components",
  },
  {
    component: CNavGroup,
    name: "System",
    icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Roles",
        to: "/admin/roles",
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "User Manager",
        to: "/admin/users",
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
    ],
  },
  //Analytic
  {
    component: CNavGroup,
    name: "Analytic",
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Total Users",
        to: "/roles/create",
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Views",
         to: "/roles/create",
        icon: <BsEye className="nav-icon" />
      },
      {
        component: CNavItem,
        name: "Traffic",
        to: "",
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Content",
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Tags Management",
        to: "/admin/tags",
        icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Series Management",
        to: "/admin/series",
        icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Posts Management",

        to: "/admin/posts",
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      },
    ],
  },

  {
    component: CNavGroup,
    name: "Notifications",
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Alerts",
        to: "/notifications/alerts",
      },
      {
        component: CNavItem,
        name: "Badges",
        to: "/notifications/badges",
      },
      {
        component: CNavItem,
        name: "Modal",
        to: "/notifications/modals",
      },
      {
        component: CNavItem,
        name: "Toasts",
        to: "/notifications/toasts",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Setting",
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "",
        to: "/login",
      },
      {
        component: CNavItem,
        name: "Register",
        to: "/register",
      },
      {
        component: CNavItem,
        name: "Error 404",
        to: "/404",
      },
      {
        component: CNavItem,
        name: "Error 500",
        to: "/500",
      },
    ],
  },
  {
    component: CNavTitle,
    name: "Extras",
  },
  {
    component: CNavGroup,
    name: "Pages",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Login",
        to: "/login",
      },
      {
        component: CNavItem,
        name: "Register",
        to: "/register",
      },
      {
        component: CNavItem,
        name: "Error 404",
        to: "/404",
      },
      {
        component: CNavItem,
        name: "Error 500",
        to: "/500",
      },
      {
        component: CNavItem,
        name: "User UI",
        to: "/posts",
      },
    ],
  },
  {
    component: CNavItem,
    name: "Docs",
    href: "https://coreui.io/react/docs/templates/installation/",
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
];

export default nav;
