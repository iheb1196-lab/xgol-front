import { useState } from "react";
import "./sidebar.scss";
import { SidebarItem } from "../SidebarItem/SidebarItem";
import navConfig, { getActiveIcon, getIcon } from "./config-navigation";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const roles = user?.user.roles || []; // default to an empty array if roles is not set

  return (
    <aside
      id="sidebar"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`sidebar-container ${expanded ? "sidebar-expanded" : "sidebar-not-expanded"}`}
    >
      <nav className="sidebar-nav">
        <div className="logo-container">
          <img
            src="/assets/images/logo.svg"
            className={`logo-sidebar ${expanded ? "opacity-1" : "opacity-0"}`}
            alt=""
          />

          <img
            src="/assets/images/logo-mini.svg"
            className={`logo-sidebar ${expanded ? "opacity-0" : "opacity-1"}`}
            alt=""
          />
        </div>
        <div
          className={`line-container  ${
            expanded ? "line-container-expanded" : "line-container-not-expanded"
          }`}
        >
          <div className="line"></div>
        </div>
        <div className="sidebar-header">
          <ul className="sidebar-body">
            {navConfig
              .filter((item) => roles.some((role) => item.roles.includes(role)))
              .map((item, i) => (
                <SidebarItem key={i} item={item} expanded={expanded} />
              ))}
          </ul>

          <div className="sidebar-footer">
            <SidebarItem
              item={{
                title: roles.includes("EXPERT") ? "Availability" : "My Account",
                icon: getIcon("account"),
                activeIcon: getActiveIcon("account"),
                path: roles.includes("EXPERT") ? "/coach/inbox" : "/dashboard/subscription",
              }}
              expanded={expanded}
              ignoreActive={true}
            />
          </div>
        </div>
      </nav>
    </aside>
  );
}
