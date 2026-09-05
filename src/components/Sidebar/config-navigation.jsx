export const getIcon = (name) => (
  <img src={`/assets/icons/navbar/${name}.svg`} alt="" />
);
export const getActiveIcon = (name) => (
  <img src={`/assets/icons/navbar/${name}-active.svg`} alt="" />
);

const navConfig = [
  {
    title: "My Coaching",
    path: "/coaching",
    icon: getIcon("expert-snack-review"),
    activeIcon: getActiveIcon("expert-snack-review"),
    roles: ["CLIENT", "ADMIN"],
  },
  {
    title: "Coaching Inbox",
    path: "/coach/inbox",
    icon: getIcon("expert-snack-review"),
    activeIcon: getActiveIcon("expert-snack-review"),
    roles: ["EXPERT"],
  },
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: getIcon("dashboard"),
    activeIcon: getActiveIcon("dashboard"),
    roles: ["CLIENT"],
    buttonClassName: "_sidebarDashboardButton",
  },
  {
    title: "Learning Lab",
    path: "/learning",
    icon: getIcon("learning"),
    activeIcon: getActiveIcon("learning"),
    roles: ["CLIENT", "ADMIN"],
  },
  {
    title: "My Speeches",
    path: "/my_speeches",
    icon: getIcon("speech"),
    activeIcon: getActiveIcon("speech"),
    roles: ["CLIENT"],
    buttonClassName: "_sidebarSpeechButton",
  },
  {
    title: "My Practices",
    path: "/my_practices",
    icon: getIcon("videos"),
    activeIcon: getActiveIcon("videos"),
    roles: ["CLIENT"],
    buttonClassName: "_sidebarVideoButton",
  },
  {
    title: "Administration",
    path: "/admin/licenses",
    icon: getIcon("admin"),
    activeIcon: getActiveIcon("admin"),
    roles: ["ADMIN"],
  },
];

export default navConfig;
