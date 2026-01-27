import React from 'react'
import { useLocation } from 'react-router-dom'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

import routes from '../../../routes/routes'

interface AppRoute {
  path: string
  name?: string
}

interface BreadcrumbItem {
  pathname: string
  name: string
  active: boolean
}

const AppBreadcrumb: React.FC = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname: string, routes: AppRoute[]): string | undefined => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute?.name
  }

  const getBreadcrumbs = (location: string): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = []

    location
      .split('/')
      .reduce((prev: string, curr: string, index: number, array: string[]) => {
        const currentPathname = `${prev}/${curr}`
        const routeName = getRouteName(currentPathname, routes as AppRoute[])

        if (routeName) {
          breadcrumbs.push({
            pathname: currentPathname,
            name: routeName,
            active: index + 1 === array.length,
          })
        }

        return currentPathname
      })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem href="/">Home</CBreadcrumbItem>

      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem
          key={index}
          {...(breadcrumb.active
            ? { active: true }
            : { href: breadcrumb.pathname })}
        >
          {breadcrumb.name}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
