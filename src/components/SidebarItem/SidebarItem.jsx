import classNames from "classnames";
import RouterLink from "../../routes/components/router-link";
import { usePathname } from "../../routes/hooks";
import "./sidebarItem.scss";

export function SidebarItem({ expanded, item, ignoreActive = false }) {
  const { title, icon, activeIcon, path } = item ?? {};
  const pathname = usePathname();
  const active = path.split("/")[1] === pathname.split("/")[1] && !ignoreActive;
  return (
    <RouterLink
      href={path}
      aria-label={title}
      aria-current={active ? "page" : undefined}
      className={classNames("sidebar-item", item?.buttonClassName, {
        "sidebar-item-active": active,
        "sidebar-item-not-active": !active,
        "sidebar-item-expanded": expanded,
        "sidebar-item-not-expanded": !expanded,
      })}
    >
      {active ? activeIcon : icon}

      <span
        className={classNames("sidebar-item-text", {
          "sidebar-item-text-expanded": expanded,
          "sidebar-item-text-not-expanded": !expanded,
        })}
      >
        {title}
      </span>
    </RouterLink>
  );
}
