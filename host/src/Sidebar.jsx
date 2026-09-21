import { NavLink } from "react-router-dom";
import { Bell, ChartColumn, LayoutDashboard, Users } from "lucide-react";
import { Avatar } from "@shared/components/Avatar";
import { useSession } from "./SessionProvider";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/users", label: "Users", icon: Users },
  { to: "/analytics", label: "Analytics", icon: ChartColumn },
  { to: "/notifications", label: "Notifications", icon: Bell }
];

export function Sidebar(props) {
  const session = useSession();
  const user = session.user;

  return (
    <aside className={"bg-sidebar sidebar " + (props.mobile ? "sidebar-mobile" : "sidebar-desktop")}>
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--accent)] text-sm font-extrabold text-white">
          N
        </div>
        <div>
          <p className="text-lg font-extrabold tracking-tight">Nexus</p>
          <p className="text-xs text-[var(--sidebar-muted)]">Micro Dashboard</p>
        </div>
      </div>

      <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--sidebar-muted)]">
        Overview
      </p>
      <nav className="flex flex-1 flex-col gap-1.5">
        {links.map(function (link) {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={props.onNavigate}
              className={function (state) {
                return state.isActive ? "nav-link active" : "nav-link";
              }}
            >
              <Icon size={18} />
              <span className="flex-1">{link.label}</span>
              {link.to === "/notifications" && session.unread > 0 ? (
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-[var(--accent)]">
                  {session.unread}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>

      {user ? (
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-3">
          <Avatar name={user.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-[var(--sidebar-muted)]">{user.role}</p>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
