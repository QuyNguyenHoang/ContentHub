import React from "react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import { CBadge, CNavLink, CSidebarNav } from "@coreui/react";

/* ================= TYPES ================= */

interface NavBadge {
  color: string;
  text: string;
}

interface NavItem {
  component: React.ElementType;
  name?: ReactNode;
  to?: string;
  href?: string;
  icon?: ReactNode;
  badge?: NavBadge;
  items?: NavItem[];
  [key: string]: any;
}

interface AppSidebarNavProps {
  items: NavItem[];
}

/* ================= COMPONENT ================= */

export const AppSidebarNav: React.FC<AppSidebarNavProps> = ({ items }) => {
  const navLink = (
    name?: ReactNode,
    icon?: ReactNode,
    badge?: NavBadge,
    indent = false,
  ) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto" size="sm">
            {badge.text}
          </CBadge>
        )}
      </>
    );
  };

  const navItem = (item: NavItem, index: number, indent = false) => {
    const { component: Component, name, badge, icon, ...rest } = item;

    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...(rest.href && { target: "_blank", rel: "noopener noreferrer" })}
            {...rest}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    );
  };

  const navGroup = (item: NavItem, index: number) => {
    const { component: Component, name, icon, items, ...rest } = item;

    return (
      <Component
        compact
        as="div"
        key={index}
        toggler={navLink(name, icon)}
        {...rest}
      >
        {items?.map((child, idx) =>
          child.items ? navGroup(child, idx) : navItem(child, idx, true),
        )}
      </Component>
    );
  };

  return (
    <CSidebarNav as={SimpleBar}>
      {items.map((item, index) =>
        item.items ? navGroup(item, index) : navItem(item, index),
      )}
    </CSidebarNav>
  );
};
