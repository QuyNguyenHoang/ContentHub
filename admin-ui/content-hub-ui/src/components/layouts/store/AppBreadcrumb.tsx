import React from "react";
import { useLocation, matchPath, Link } from "react-router-dom";

import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";

import routes from "../../../routes/routes";

interface AppRoute {
  path?: string;
  name?: string;
  children?: AppRoute[];
}

interface BreadcrumbItem {
  pathname: string;
  name: string;
  active: boolean;
}

const AppBreadcrumb: React.FC = () => {
  const currentLocation = useLocation().pathname;

  // Recursive search route name
  const getRouteName = (
    pathname: string,
    routes: AppRoute[],
    parentPath = "",
  ): string | undefined => {
    for (const route of routes) {
      const fullPath = route.path
        ? `${parentPath}/${route.path}`.replace(/\/+/g, "/")
        : parentPath;

      // Match current route
      if (
        fullPath &&
        matchPath(
          {
            path: fullPath,
            end: true,
          },
          pathname,
        )
      ) {
        return route.name;
      }

      // Search child routes
      if (route.children) {
        const childRouteName = getRouteName(pathname, route.children, fullPath);

        if (childRouteName) {
          return childRouteName;
        }
      }
    }

    return undefined;
  };

  const getBreadcrumbs = (location: string): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];

    location
      .split("/")
      .filter(Boolean)
      .reduce((prev: string, curr: string, index: number, array: string[]) => {
        const currentPathname = `${prev}/${curr}`;

        const routeName = getRouteName(currentPathname, routes as AppRoute[]);

        if (routeName) {
          breadcrumbs.push({
            pathname: currentPathname,
            name: routeName,
            active: index === array.length - 1,
          });
        }

        return currentPathname;
      }, "");

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(currentLocation);

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem>
        <Link to="/">Home</Link>
      </CBreadcrumbItem>

      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem key={index} active={breadcrumb.active}>
          {breadcrumb.active ? (
            breadcrumb.name
          ) : (
            <Link to={breadcrumb.pathname}>{breadcrumb.name}</Link>
          )}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  );
};

export default React.memo(AppBreadcrumb);
